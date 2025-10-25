'use client';

import React, { useState, useEffect } from 'react';
import { CreateBaseForm, BaseFormField } from '@/components/BaseForm';
import { updateUser, setUserStatus } from '@/app/actions/users';
import type { AdministratorType } from './types';

interface UpdateAdminFormProps {
	administrator: AdministratorType | null;
	onSubmitSuccess: () => void; // Callback after successful update
	onError: (error: string) => void; // Callback for errors
}

const UpdateAdminForm: React.FC<UpdateAdminFormProps> = ({
	administrator,
	onSubmitSuccess,
	onError,
}) => {
	const [formData, setFormData] = useState<Record<string, any>>({});
	const [loading, setLoading] = useState(false);

	// Initialize form with administrator data
	useEffect(() => {
		if (administrator) {
			const statusMap: Record<string, number> = {
				'ACTIVE': 1,
				'INACTIVE': 2,
			};
			setFormData({
				username: administrator.username || '',
				email: administrator.email || '',
				firstName: administrator.personalInfo?.firstName || '',
				lastName: administrator.personalInfo?.lastName || '',
				phone: administrator.personalInfo?.phone || '',
				status: statusMap[administrator.status] || 1,
			});
		}
	}, [administrator]);

	const handleFieldChange = (field: string, value: any) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async () => {
		if (!administrator) return;

		setLoading(true);
		try {
			// Basic validations
			if (!formData.username?.trim()) {
				onError('El nombre de usuario es obligatorio');
				setLoading(false);
				return;
			}
			if (!formData.email?.trim()) {
				onError('El email es obligatorio');
				setLoading(false);
				return;
			}

			const statusMap: Record<number, string> = {
				1: 'ACTIVE',
				2: 'INACTIVE',
			};
			const newStatus = statusMap[formData.status] || 'ACTIVE';
			const currentStatus = administrator.status;

			// Update user data (excluding status)
			const updateData = {
				username: formData.username.trim(),
				email: formData.email.trim(),
				personalInfo: {
					firstName: formData.firstName?.trim() || undefined,
					lastName: formData.lastName?.trim() || undefined,
					phone: formData.phone?.trim() || undefined,
				},
			};

			const result = await updateUser(administrator.id, updateData);
			if (!result.success) {
				onError(result.error || 'Error al actualizar el administrador');
				setLoading(false);
				return;
			}

			// Update status if changed
			if (newStatus !== currentStatus) {
				const statusResult = await setUserStatus(administrator.id, newStatus as 'ACTIVE' | 'INACTIVE');
				if (!statusResult.success) {
					onError(statusResult.error || 'Error al actualizar el estado');
					setLoading(false);
					return;
				}
			}

			onSubmitSuccess();
		} catch (err) {
			onError('Error inesperado al actualizar el administrador');
		} finally {
			setLoading(false);
		}
	};

	const fields: BaseFormField[] = [
		{
			name: 'username',
			label: 'Nombre de usuario',
			type: 'text',
			required: true,
		},
		{
			name: 'email',
			label: 'Email',
			type: 'email',
			required: true,
		},
		{
			name: 'firstName',
			label: 'Nombre',
			type: 'text',
		},
		{
			name: 'lastName',
			label: 'Apellido',
			type: 'text',
		},
		{
			name: 'phone',
			label: 'Teléfono',
			type: 'text',
		},
		{
			name: 'status',
			label: 'Estado',
			type: 'select',
			required: true,
			options: [
				{ id: 1, label: 'Activo' },
				{ id: 2, label: 'Inactivo' },
			],
		},
	];

	return (
		<CreateBaseForm
			fields={fields}
			values={formData}
			onChange={handleFieldChange}
			onSubmit={handleSubmit}
			isSubmitting={loading}
			submitLabel="Guardar Cambios"
			title=""
			subtitle=""
			errors={[]} // Errors handled via onError prop
			columns={1}
		/>
	);
};

export default UpdateAdminForm;