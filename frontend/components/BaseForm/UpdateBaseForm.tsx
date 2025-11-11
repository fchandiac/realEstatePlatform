
import React, { useState, useEffect } from "react";
import { TextField } from "../TextField/TextField";
import AutoComplete, { Option } from "../AutoComplete/AutoComplete";
import { Button } from "../Button/Button";
import CircularProgress from "../CircularProgress/CircularProgress";
import DotProgress from "../DotProgress/DotProgress";
import Alert from "../Alert/Alert";
import Switch from "../Switch/Switch";
import Select from "../Select/Select";
import RangeSlider from "../RangeSlider/RangeSlider";
import UpdateLocationPicker from "../LocationPicker/UpdateLocationPickerWrapper";
import MultimediaUpdater from "../FileUploader/MultimediaUpdater";

export interface BaseUpdateFormFieldGroup {
	id?: string;
	title?: string;
	subtitle?: string;
	columns?: number;
	gap?: number;
	fields: BaseUpdateFormField[];
}

type UpdateBaseFormFields = BaseUpdateFormField[] | BaseUpdateFormFieldGroup[];

export interface BaseUpdateFormField {
	name: string;
	label: string;
	type:
		| "text"
		| "textarea"
		| "autocomplete"
		| "number"
		| "email"
		| "password"
		| "switch"
		| "select"
		| "range"
		| "location"
		| "dni"
		| "currency"
		| "image"
		| "video"
		| "avatar";
	required?: boolean;
	options?: Option[];
	multiline?: boolean;
	rows?: number;
	disabled?: boolean;
	formatFn?: (input: string) => string;
	startIcon?: string;
	endIcon?: string;
	min?: number;
	max?: number;
	// Props para campos multimedia
	currentUrl?: string;
	currentType?: 'image' | 'video';
	acceptedTypes?: string[];
	maxSize?: number;
	aspectRatio?: '1:1' | '16:9' | '9:16';
	buttonText?: string;
	labelText?: string;
}

export interface UpdateBaseFormProps {
	fields: UpdateBaseFormFields;
	initialState: Record<string, any>;
	onSubmit: (values: Record<string, any>) => void;
	isSubmitting?: boolean;
	errors?: string[];
	title?: string;
	subtitle?: string;
	submitLabel?: string;
	["data-test-id"]?: string;
	columns?: number;
	showCloseButton?: boolean;
	closeButtonText?: string;
	onClose?: () => void;
}


const isFieldGroupArray = (items: UpdateBaseFormFields): items is BaseUpdateFormFieldGroup[] => {
	return Array.isArray(items) && items.length > 0 && Boolean((items[0] as BaseUpdateFormFieldGroup).fields);
};

const UpdateBaseForm: React.FC<UpdateBaseFormProps> = ({
	fields,
	initialState,
	onSubmit,
	isSubmitting = false,
	errors = [],
	title = "Elemento",
	subtitle,
	submitLabel,
	columns = 1,
	showCloseButton = false,
	closeButtonText = "cerrar",
	onClose,
	...props
}) => {
	const dataTestId = props["data-test-id"];
	const [values, setValues] = useState(initialState);

	useEffect(() => {
		setValues(initialState);
	}, [initialState]);

	const handleChange = (field: string, value: any) => {
		setValues((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(values);
	};

	// Renderizar campo individual
	const renderField = (field: BaseUpdateFormField) => (
		<>
			{field.type === "location" ? (
				<UpdateLocationPicker
					initialCoordinates={values[field.name]}
					onChange={coords => handleChange(field.name, coords)}
				/>
			) : field.type === "range" ? (
				<RangeSlider
					min={field.min ?? 0}
					max={field.max ?? 100}
					value={values[field.name]}
					onChange={val => handleChange(field.name, val)}
				/>
			) : field.type === "select" ? (
				<Select
					options={field.options || []}
					placeholder={field.label}
					value={values[field.name]}
					onChange={(id: string | number | null) => handleChange(field.name, id)}
				/>
			) : field.type === "autocomplete" ? (
				<AutoComplete
					options={field.options || []}
					label={field.label}
					value={field.options?.find(opt => opt.id === values[field.name]) || null}
					onChange={opt => handleChange(field.name, opt?.id || "")}
					required={field.required}
					name={field.name}
				/>
			) : field.type === "switch" ? (
				<Switch
					checked={Boolean(values[field.name])}
					onChange={val => handleChange(field.name, val)}
					label={field.label}
				/>
			) : field.type === "image" || field.type === "video" || field.type === "avatar" ? (
				<MultimediaUpdater
					currentUrl={field.currentUrl || values[field.name]}
					currentType={field.currentType || (field.type === 'video' ? 'video' : 'image')}
					variant={field.type === 'avatar' ? 'avatar' : 'default'}
					acceptedTypes={field.acceptedTypes || (field.type === 'video' ? ['video/*'] : ['image/*'])}
					maxSize={field.maxSize || (field.type === 'avatar' ? 2 : 5)}
					aspectRatio={field.aspectRatio || (field.type === 'avatar' ? '1:1' : '16:9')}
					buttonText={field.buttonText || (field.type === 'avatar' ? 'Cambiar avatar' : field.type === 'video' ? 'Actualizar video' : 'Actualizar imagen')}
					labelText={field.labelText ?? field.label}
					onFileChange={(file) => {
						// Actualizar el estado con el archivo seleccionado (para upload en submit)
						handleChange(`${field.name}File`, file);
						// Opcional: Generar preview URL
						if (file) {
							const previewUrl = URL.createObjectURL(file);
							handleChange(field.name, previewUrl);
						} else {
							handleChange(field.name, field.currentUrl || '');
						}
					}}
				/>
			) : (
				<TextField
					label={field.label}
					value={values[field.name] || ""}
					onChange={e => handleChange(field.name, field.formatFn ? field.formatFn(e.target.value) : e.target.value)}
					type={field.type}
					name={field.name}
					rows={field.multiline ? field.rows : undefined}
					startIcon={field.startIcon}
					endIcon={field.endIcon}
					required={field.required}
					disabled={field.disabled}
				/>
			)}
		</>
	);

	const resolvedGroups = React.useMemo(() => {
		if (isFieldGroupArray(fields)) {
			return fields.map((group, index) => ({
				id: group.id ?? `group-${index}`,
				title: group.title,
				subtitle: group.subtitle,
				columns: Math.max(1, group.columns ?? columns ?? 1),
				gap: group.gap ?? 16,
				fields: group.fields,
			}));
		}

		return [{
			id: "group-default",
			title: undefined,
			subtitle: undefined,
			columns: Math.max(1, columns ?? 1),
			gap: 16,
			fields: fields as BaseUpdateFormField[],
		}];
	}, [fields, columns]);

	return (
		<form
			onSubmit={handleSubmit}
			className="w-full flex flex-col gap-4"
			{...(dataTestId ? { 'data-test-id': dataTestId } : {})}
		>
			{title && title !== "" && (
				<div className="title p-1 pb-0 w-full mb-0 leading-tight">{title}</div>
			)}
			{subtitle && subtitle !== "" && (
				<div className="subtitle p-1 pt-0 w-full mb-3 leading-snug">{subtitle}</div>
			)}
			{resolvedGroups.map((group) => {
				const columnCount = Math.max(1, group.columns);
				const gapValue = typeof group.gap === "number" ? `${group.gap}px` : group.gap;
				const containerClass = columnCount > 1 ? "grid" : "flex flex-col";
				const containerStyle = columnCount > 1 ? { gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`, gap: gapValue ?? "1rem" } : { gap: gapValue ?? "0.5rem" };

				return (
					<div key={group.id} className="flex flex-col gap-3 w-full">
						{group.title && <h4 className="text-base font-semibold text-gray-900">{group.title}</h4>}
						{group.subtitle && <p className="text-sm text-gray-600">{group.subtitle}</p>}
						<div className={`${containerClass}`} style={containerStyle as React.CSSProperties}>
							{group.fields.map((field, index) => (
								<div key={`${group.id}-${field.name}-${index}`} className="mb-2">
									{renderField(field)}
								</div>
							))}
						</div>
					</div>
				);
			})}
			<div className="flex justify-between mt-4 w-full">
				<div>
					{showCloseButton && onClose && (
						<Button
							variant="outlined"
							type="button"
							onClick={onClose}
							disabled={isSubmitting}
						>
							{closeButtonText}
						</Button>
					)}
				</div>
				<div>
					{isSubmitting ? (
						<DotProgress size={18} className="self-end" />
					) : (
						<Button variant="primary" type="submit">
							{submitLabel ?? "Actualizar"}
						</Button>
					)}
				</div>
			</div>
			{errors.length > 0 && (
				<div className="flex flex-col gap-2 mt-4">
					{errors.map((err, i) => (
						<Alert key={i} variant="error">{err}</Alert>
					))}
				</div>
			)}
		</form>
	);
};

export default UpdateBaseForm;