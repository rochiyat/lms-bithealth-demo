import { CrudPage } from '@/components/CrudPage';
import { StatusPill } from '@/components/ui';
import { useAppData } from '@/contexts/AppDataContext';
import type { Department, Group, JobFamily, Squad, Tenant, User } from '@/domain/types';
import { formatDate, labelize } from '@/utils/format';

const statusOptions = [{ value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }];

export function GroupsTenantsPage() {
  const { db } = useAppData();
  const groupOptions = db?.groups.map((item) => ({ value: item.id, label: item.name })) ?? [];
  return <div className="stack-page">
    <CrudPage collection="groups" title="Groups" description="Kelola organisasi induk pada platform multi-tenant." fields={[
      { key: 'name', label: 'Nama group', required: true }, { key: 'code', label: 'Kode', required: true }, { key: 'status', label: 'Status', type: 'select', options: statusOptions, defaultValue: 'ACTIVE' },
    ]} columns={[
      { key: 'name', label: 'Nama' }, { key: 'code', label: 'Kode' }, { key: 'status', label: 'Status', render: (item) => <StatusPill value={(item as Group).status} /> }, { key: 'createdAt', label: 'Dibuat', render: (item) => formatDate((item as Group).createdAt) },
    ]} tenantId="" />
    <div className="section-divider" />
    <CrudPage collection="tenants" title="Tenants" description="Perusahaan atau unit bisnis yang memakai Learning Hub." fields={[
      { key: 'groupId', label: 'Group', type: 'select', options: groupOptions, required: true }, { key: 'name', label: 'Nama tenant', required: true }, { key: 'code', label: 'Kode', required: true }, { key: 'industry', label: 'Industri', required: true }, { key: 'status', label: 'Status', type: 'select', options: statusOptions, defaultValue: 'ACTIVE' },
    ]} columns={[
      { key: 'name', label: 'Tenant' }, { key: 'code', label: 'Kode' }, { key: 'industry', label: 'Industri' }, { key: 'status', label: 'Status', render: (item) => <StatusPill value={(item as Tenant).status} /> },
    ]} />
  </div>;
}

export function EmployeesPage() {
  const { db } = useAppData();
  const departmentOptions = db?.departments.map((item) => ({ value: item.id, label: item.name })) ?? [];
  const familyOptions = db?.jobFamilies.map((item) => ({ value: item.id, label: item.name })) ?? [];
  const managerOptions = db?.users.filter((item) => ['MANAGER','HR_ADMIN'].includes(item.role)).map((item) => ({ value: item.id, label: item.name })) ?? [];
  return <CrudPage collection="users" title="Employees" description="Kelola identitas, organisasi, manager, dan akses pengguna." fields={[
    { key: 'employeeId', label: 'Employee ID', required: true }, { key: 'name', label: 'Nama lengkap', required: true }, { key: 'email', label: 'Email', required: true }, { key: 'password', label: 'Password demo', defaultValue: 'demo123', required: true },
    { key: 'role', label: 'Role', type: 'select', required: true, defaultValue: 'EMPLOYEE', options: [{value:'SUPER_ADMIN',label:'Super Admin'},{value:'HR_ADMIN',label:'HR Admin'},{value:'MANAGER',label:'Manager'},{value:'EMPLOYEE',label:'Employee'}] },
    { key: 'departmentId', label: 'Department', type: 'select', options: departmentOptions, required: true }, { key: 'jobFamilyId', label: 'Job family', type: 'select', options: familyOptions, required: true },
    { key: 'jobTitle', label: 'Job title', required: true }, { key: 'managerId', label: 'Manager', type: 'select', options: managerOptions }, { key: 'joinDate', label: 'Tanggal bergabung', type: 'date', required: true },
    { key: 'status', label: 'Status', type: 'select', options: statusOptions, defaultValue: 'ACTIVE' }, { key: 'points', label: 'Initial points', type: 'number', defaultValue: 0 }, { key: 'level', label: 'Level', defaultValue: 'Explorer' }, { key: 'streakWeeks', label: 'Streak minggu', type: 'number', defaultValue: 0 },
  ]} columns={[
    { key: 'employeeId', label: 'Employee ID' }, { key: 'name', label: 'Nama' }, { key: 'email', label: 'Email' },
    { key: 'departmentId', label: 'Department', render: (item) => db?.departments.find((d) => d.id === (item as User).departmentId)?.name ?? '-' },
    { key: 'jobTitle', label: 'Job title' }, { key: 'role', label: 'Role', render: (item) => labelize((item as User).role) }, { key: 'status', label: 'Status', render: (item) => <StatusPill value={(item as User).status} /> },
  ]} />;
}

export function DepartmentsPage() {
  const { db } = useAppData();
  const managerOptions = db?.users.filter((item) => ['MANAGER','HR_ADMIN'].includes(item.role)).map((item) => ({ value: item.id, label: item.name })) ?? [];
  return <CrudPage collection="departments" title="Departments" description="Kelola unit organisasi dan manager masing-masing department." fields={[
    { key: 'name', label: 'Nama department', required: true }, { key: 'code', label: 'Kode', required: true }, { key: 'managerId', label: 'Manager', type: 'select', options: managerOptions }, { key: 'status', label: 'Status', type: 'select', options: statusOptions, defaultValue: 'ACTIVE' },
  ]} columns={[
    { key: 'name', label: 'Department' }, { key: 'code', label: 'Kode' }, { key: 'managerId', label: 'Manager', render: (item) => db?.users.find((u) => u.id === (item as Department).managerId)?.name ?? '-' },
    { key: 'status', label: 'Status', render: (item) => <StatusPill value={(item as Department).status} /> },
  ]} />;
}

export function JobFamiliesPage() {
  return <CrudPage collection="jobFamilies" title="Job Families" description="Kelompok kompetensi untuk assignment dan learning path." fields={[
    { key: 'name', label: 'Nama job family', required: true }, { key: 'code', label: 'Kode', required: true }, { key: 'description', label: 'Deskripsi', type: 'textarea', required: true }, { key: 'status', label: 'Status', type: 'select', options: statusOptions, defaultValue: 'ACTIVE' },
  ]} columns={[
    { key: 'name', label: 'Job family' }, { key: 'code', label: 'Kode' }, { key: 'description', label: 'Deskripsi' }, { key: 'status', label: 'Status', render: (item) => <StatusPill value={(item as JobFamily).status} /> },
  ]} />;
}

export function SquadsPage() {
  const { db } = useAppData();
  const leadOptions = db?.users.filter((item) => item.role === 'MANAGER').map((item) => ({ value: item.id, label: item.name })) ?? [];
  return <CrudPage collection="squads" title="Project Squads" description="Tim proyek lintas department untuk kebutuhan reporting dan challenge." fields={[
    { key: 'name', label: 'Nama squad', required: true }, { key: 'client', label: 'Client / project', required: true }, { key: 'leadId', label: 'Squad lead', type: 'select', options: leadOptions, required: true }, { key: 'memberIds', label: 'Member IDs', type: 'tags' }, { key: 'status', label: 'Status', type: 'select', options: statusOptions, defaultValue: 'ACTIVE' },
  ]} columns={[
    { key: 'name', label: 'Squad' }, { key: 'client', label: 'Client' }, { key: 'leadId', label: 'Lead', render: (item) => db?.users.find((u) => u.id === (item as Squad).leadId)?.name ?? '-' }, { key: 'memberIds', label: 'Members', render: (item) => (item as Squad).memberIds.length }, { key: 'status', label: 'Status', render: (item) => <StatusPill value={(item as Squad).status} /> },
  ]} />;
}
