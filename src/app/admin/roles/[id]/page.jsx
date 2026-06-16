'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import RoleForm from '../../../../components/admin/RoleForm';
import { api, fetchAll } from '../../../../lib/api';

/**
 * Page for editing an existing role.
 * It loads the role data (including assigned permissions) and passes it to RoleForm.
 * The RoleForm component will handle updating the role and its permissions.
 */
export default function EditRolePage() {
  const router = useRouter();
  const { id } = useParams(); // role id from the URL
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Fetch role details (id and name)
        const roleData = await api.get(`/api/roles/${id}/`);
        // Fetch permissions for this role
        const perms = await api.get(`/api/roles/${id}/permissions/`);
        setRole({
          id: roleData.id,
          name: roleData.name,
          permissions: perms.permissions || [],
        });
      } catch (err) {
        console.error('Failed to load role', err);
        // If role cannot be loaded, navigate back to list
        router.back();
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <RoleForm initialRole={role} roleId={id} />;
}
