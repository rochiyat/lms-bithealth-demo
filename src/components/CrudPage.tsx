import { Button, Input } from '@heroui/react';
import { Download, Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useRef, useState, useEffect } from 'react';
import type { CollectionItem, CollectionName } from '@/domain/types';
import { useAppData } from '@/contexts/AppDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader, SearchInput, StatusPill, Pagination } from './ui';
import { labelize } from '@/utils/format';
import { useToast } from './Toast';

export interface CrudField {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'textarea' | 'tags';
  options?: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: unknown;
}

interface CrudColumn<T> { key: string; label: string; render?: (item: T) => React.ReactNode; }

export function CrudPage<K extends CollectionName>({ collection, title, description, fields, columns, tenantId }: {
  collection: K;
  title: string;
  description: string;
  fields: CrudField[];
  columns: CrudColumn<CollectionItem<K>>[];
  tenantId?: string;
}) {
  const { db, createItem, updateItem, deleteItem } = useAppData();
  const { activeTenantId } = useAuth();
  const { showToast } = useToast();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [editingId, setEditingId] = useState<string>();
  const [query, setQuery] = useState('');
  const [form, setForm] = useState<Record<string, unknown>>({});
  
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const rawRows = (db?.[collection] ?? []) as CollectionItem<K>[];
  const rows = useMemo(() => {
    return rawRows.filter((item) => {
      const hasTenantId = 'tenantId' in (item as any);
      if (!hasTenantId || !(item as any).tenantId) return true;
      return (item as any).tenantId === activeTenantId;
    });
  }, [rawRows, activeTenantId]);

  const filtered = useMemo(() => rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase())), [rows, query]);

  // Reset to first page when query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, currentPage]);

  const openCreate = () => {
    setEditingId(undefined);
    setForm(Object.fromEntries(fields.map((field) => [field.key, field.defaultValue ?? (field.type === 'boolean' ? false : '')])));
    dialogRef.current?.showModal();
  };

  const openEdit = (row: CollectionItem<K>) => {
    setEditingId(row.id);
    setForm(Object.fromEntries(fields.map((field) => [field.key, (row as unknown as Record<string, unknown>)[field.key] ?? ''])));
    dialogRef.current?.showModal();
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const resolvedTenantId = tenantId || activeTenantId || 'tenant_bithealth';
    const payload = { ...form, tenantId: resolvedTenantId } as never;
    try {
      if (editingId) {
        await updateItem(collection, editingId, payload);
        showToast(`Berhasil memperbarui ${title.toLowerCase()}`, 'success');
      } else {
        await createItem(collection, payload);
        showToast(`Berhasil menambahkan ${title.toLowerCase()}`, 'success');
      }
    } catch {
      showToast(`Gagal menyimpan ${title.toLowerCase()}`, 'error');
    }
    dialogRef.current?.close();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus data ini?')) {
      try {
        await deleteItem(collection, id);
        showToast(`Berhasil menghapus data`, 'success');
      } catch {
        showToast(`Gagal menghapus data`, 'error');
      }
    }
  };

  const download = () => {
    try {
      const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${collection}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      showToast(`Database ${collection} berhasil diekspor`, 'success');
    } catch {
      showToast(`Gagal mengekspor database`, 'error');
    }
  };

  return <>
    <PageHeader title={title} description={description} actions={<><Button variant="secondary" onPress={download}><Download size={16} />Export</Button><Button onPress={openCreate}><Plus size={16} />Tambah</Button></>} />
    <div className="table-toolbar"><SearchInput value={query} onChange={setQuery} /><span>{filtered.length} data</span></div>
    <div className="data-table-wrap">
      <table className="data-table">
        <thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}<th>Aksi</th></tr></thead>
        <tbody>{paginatedRows.map((row) => <tr key={row.id}>
          {columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : renderCell((row as unknown as Record<string, unknown>)[column.key])}</td>)}
          <td><div className="row-actions"><Button isIconOnly size="sm" variant="ghost" aria-label="Edit" onPress={() => openEdit(row)}><Pencil size={15} /></Button><Button isIconOnly size="sm" variant="ghost" aria-label="Hapus" onPress={() => void handleDelete(row.id)}><Trash2 size={15} /></Button></div></td>
        </tr>)}</tbody>
      </table>
    </div>

    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

    <dialog className="entity-dialog" ref={dialogRef}>
      <form onSubmit={save}>
        <div className="dialog-header"><div><h2>{editingId ? 'Ubah' : 'Tambah'} {title}</h2><p>Data tersimpan di localStorage melalui repository layer.</p></div><Button type="button" isIconOnly variant="ghost" onPress={() => dialogRef.current?.close()}>×</Button></div>
        <div className="dialog-form">
          {fields.map((field) => <label className={field.type === 'textarea' ? 'field-span' : ''} key={field.key}>
            <span>{field.label}{field.required && ' *'}</span>
            {field.type === 'select' ? <select required={field.required} value={String(form[field.key] ?? '')} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}><option value="">Pilih...</option>{field.options?.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select>
              : field.type === 'boolean' ? <input type="checkbox" checked={Boolean(form[field.key])} onChange={(event) => setForm({ ...form, [field.key]: event.target.checked })} />
              : field.type === 'textarea' ? <textarea required={field.required} value={String(form[field.key] ?? '')} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} />
              : field.type === 'tags' ? <Input value={Array.isArray(form[field.key]) ? (form[field.key] as string[]).join(', ') : String(form[field.key] ?? '')} onChange={(event) => setForm({ ...form, [field.key]: event.target.value.split(',').map((v) => v.trim()).filter(Boolean) })} placeholder="Pisahkan dengan koma" />
              : <Input required={field.required} type={field.type ?? 'text'} value={String(form[field.key] ?? '')} onChange={(event) => setForm({ ...form, [field.key]: field.type === 'number' ? Number(event.target.value) : event.target.value })} />}
          </label>)}
        </div>
        <div className="dialog-actions"><Button type="button" variant="secondary" onPress={() => dialogRef.current?.close()}>Batal</Button><Button type="submit">Simpan</Button></div>
      </form>
    </dialog>
  </>;
}

function renderCell(value: unknown) {
  if (typeof value === 'boolean') return value ? 'Ya' : 'Tidak';
  if (Array.isArray(value)) return value.join(', ') || '-';
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'string' && ['ACTIVE', 'INACTIVE', 'DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED', 'COMPLETED'].includes(value)) return <StatusPill value={value} />;
  return typeof value === 'string' && value.includes('_') ? labelize(value) : String(value);
}
