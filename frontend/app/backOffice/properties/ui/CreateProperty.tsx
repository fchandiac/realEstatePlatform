'use client'
import React, { useState, useEffect } from 'react';
import Dialog from '@/components/Dialog/Dialog';
import StepperBaseForm, { StepperStep } from '@/components/BaseForm/StepperBaseForm';
import { TextField } from '@/components/TextField/TextField';
import Select from '@/components/Select/Select';
import AutoComplete from '@/components/AutoComplete/AutoComplete';
import FileImageUploader from '@/components/FileUploader/FileImageUploader';
import CreateLocationPicker from '@/components/LocationPicker/CreateLocationPickerWrapper';
import { Button } from '@/components/Button/Button';
import Alert from '@/components/Alert/Alert';
import DotProgress from '@/components/DotProgress/DotProgress';
import FontAwesome from '@/components/FontAwesome/FontAwesome';
import { getPropertyTypesMinimal } from '@/app/actions/propertyTypesMinimal';
import { listAdminsAgents } from '@/app/actions/users';
import { getRegiones, getComunas, getComunasByRegion } from '@/app/actions/commons';
import { PROPERTY_STATUSES, OPERATION_TYPES, CURRENCY_TYPES } from '@/app/constants';
import NumberStepper from '@/components/NumberStepper/NumberStepper';
import MultimediaGallery from '@/components/FileUploader/MultimediaGallery';
import IconButton from '@/components/IconButton/IconButton';

const steps: StepperStep[] = [
	{
		title: 'Datos generales',
		description: 'Información básica de la propiedad como título, descripción y tipo de operación',
		fields: [
			{ name: 'title', label: 'Título', type: 'text', required: true },
			{ name: 'description', label: 'Descripción', type: 'textarea', rows: 3 },
			{ name: 'status', label: 'Estado publicación', type: 'select', required: true, options: [ { id: 1, label: 'Publicado' }, { id: 2, label: 'Inactivo' } ] },
			{ name: 'operationType', label: 'Operación', type: 'select', required: true, options: [ { id: 1, label: 'Venta' }, { id: 2, label: 'Arriendo' } ] },
			{ name: 'propertyTypeId', label: 'Tipo de propiedad', type: 'select', options: [] },
			{ name: 'assignedAgentId', label: 'Agente asignado', type: 'autocomplete', options: [] },
		],
	},
	{
		title: 'Ubicación',
		description: 'Define la ubicación geográfica de tu propiedad con dirección y coordenadas',
		fields: [
			{ name: 'state', label: 'Región', type: 'autocomplete', options: [] },
			{ name: 'city', label: 'Comuna', type: 'autocomplete', options: [] },
			{ name: 'address', label: 'Dirección', type: 'text' },
			{ name: 'location', label: 'Ubicación', type: 'location' },
		],
	},
	{
		title: 'Características',
		description: 'Detalles físicos y características específicas de la propiedad',
		fields: [
			{ name: 'bedrooms', label: 'Dormitorios', type: 'number' },
			{ name: 'bathrooms', label: 'Baños', type: 'number' },
			{ name: 'parkingSpaces', label: 'Estacionamientos', type: 'number' },
			{ name: 'floors', label: 'Pisos', type: 'number' },
			{ name: 'builtSquareMeters', label: 'Metros construidos', type: 'number', required: true },
			{ name: 'landSquareMeters', label: 'Metros terreno', type: 'number', required: true },
			{ name: 'constructionYear', label: 'Año construcción', type: 'number' },
		],
	},
	{
		title: 'Precio',
		description: 'Configuración de precio y moneda de la propiedad',
		fields: [
			{ name: 'price', label: 'Precio', type: 'currency', required: true },
			{ name: 'currencyPrice', label: 'Moneda', type: 'select', required: true, options: [] },
		],
	},
	{
		title: 'SEO',
		description: 'Optimización para motores de búsqueda y metadatos',
		fields: [
			{ name: 'seoTitle', label: 'Título SEO', type: 'text' },
			{ name: 'seoDescription', label: 'Descripción SEO', type: 'textarea', rows: 3 },
		],
	},
	{
		title: 'Multimedia',
		description: 'Imágenes y videos que acompañarán la publicación',
		fields: [
			{ name: 'multimedia', label: 'Imágenes y videos', type: 'text' }, // Puedes reemplazar por un uploader custom si lo necesitas
		],
	},
	{
		title: 'Internos',
		description: 'Notas y comentarios internos para el equipo',
		fields: [
			{ name: 'internalNotes', label: 'Notas internas', type: 'textarea', rows: 6 },
		],
	},
];

interface CreatePropertyProps {
	open: boolean;
	onClose: () => void;
	onSave: (form: any) => Promise<void>;
	operationType?: 'SALE' | 'RENT'; // Nueva prop opcional
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	scroll?: 'body' | 'paper';
}

export default function CreateProperty({ open, onClose, onSave, operationType }: CreatePropertyProps) {
	const [form, setForm] = useState<Record<string, any>>({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [propertyTypes, setPropertyTypes] = useState<Array<{ id: string; label: string }>>([]);
	const [agents, setAgents] = useState<Array<{ id: string; label: string }>>([]);
	const [regiones, setRegiones] = useState<Array<{ id: string; label: string }>>([]);
	const [comunas, setComunas] = useState<Array<{ id: string; label: string }>>([]);
	const [loadingOptions, setLoadingOptions] = useState(true);
	const [filteredComunas, setFilteredComunas] = useState<Array<{ id: string; label: string }>>([]);

	const numericFields = ['bedrooms', 'bathrooms', 'parkingSpaces', 'floors', 'builtSquareMeters', 'landSquareMeters', 'constructionYear'];

	// Inicializar form con operationType si viene definido
	useEffect(() => {
		if (operationType) {
			setForm(prev => ({ ...prev, operationType }));
		}
	}, [operationType]);

	// Load options when component mounts
	useEffect(() => {
		const loadOptions = async () => {
			setLoadingOptions(true);
			try {
				// Load property types
				const propertyTypesResult = await getPropertyTypesMinimal();
				setPropertyTypes(propertyTypesResult.map(pt => ({ id: pt.id, label: pt.name })));

				// Load administrators and agents
				const usersResult = await listAdminsAgents({ limit: 100 });
				if (usersResult.success && usersResult.data) {
					// Handle both response formats: direct array or { data: array, ... }
					const usersArray = Array.isArray(usersResult.data) ? usersResult.data : usersResult.data.data || [];
					const formattedUsers = usersArray.map((user: any) => ({
						id: user.id,
						label: `${user.personalInfo?.firstName || ''} ${user.personalInfo?.lastName || ''} (${user.username || ''})`.trim()
					}));
					setAgents(formattedUsers);
				}

				// Load regiones
				const regionesResult = await getRegiones();
				setRegiones(regionesResult);

				// Load comunas
				const comunasResult = await getComunas();
				setComunas(comunasResult);
			} catch (error) {
				console.error('Error loading options:', error);
			} finally {
				setLoadingOptions(false);
			}
		};

		loadOptions();
	}, []);

	const handleChange = (field: string, value: any) => {
		let processedValue = value;
		// Parse numeric fields that come from TextField type="number"
		if (['builtSquareMeters', 'landSquareMeters', 'constructionYear'].includes(field)) {
			const num = parseFloat(value);
			if (isNaN(num)) {
				console.warn(`Invalid number for ${field}: ${value}`);
				return;
			}
			processedValue = num;
		}
		console.log(`Field changed: ${field}, Value:`, processedValue); // Depurar cambios en el campo
		setForm(prev => ({ ...prev, [field]: processedValue }));

		// Clear step errors when a required field is filled
		if (stepErrors[activeStep] && stepErrors[activeStep].length > 0) {
			const currentStep = steps[activeStep];
			const fieldConfig = currentStep.fields.find(f => f.name === field);
			if (fieldConfig?.required && value !== undefined && value !== null && value !== '') {
				setStepErrors(prev => ({ ...prev, [activeStep]: [] }));
			}
		}

		if (field === 'state') {
			if (!value) {
				console.warn('State cleared, resetting comunas');
				setFilteredComunas([]); // Limpiar comunas filtradas
				setForm(prev => ({ ...prev, city: '' })); // Limpiar comuna seleccionada
				return;
			}

			const filterComunas = async () => {
				try {
					const regionId = value.id; // Usar solo el id de la región
					console.log('Fetching comunas for region:', regionId); // Depurar valor de región
					const regionComunas = await getComunasByRegion(regionId);
					console.log('Comunas fetched:', regionComunas); // Depurar comunas obtenidas
					setFilteredComunas(regionComunas);
					console.log('Filtered comunas state updated:', regionComunas); // Verificar estado actualizado
					setForm(prev => ({ ...prev, city: '' })); // Resetear comuna seleccionada
				} catch (error) {
					console.error('Error al cargar comunas:', error);
					setFilteredComunas([]); // En caso de error, dejar vacío
				}
			};
			filterComunas();
		}
	};

	const handleSubmit = async () => {
		// Validate all steps before submitting
		let allStepsValid = true;
		const allErrors: Record<number, string[]> = {};

		for (let i = 0; i < steps.length; i++) {
			const stepValid = validateStep(i);
			if (!stepValid) {
				allStepsValid = false;
				allErrors[i] = stepErrors[i] || [];
			}
		}

		if (!allStepsValid) {
			setStepErrors(allErrors);
			setError('Completa todos los campos obligatorios antes de guardar');
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);
		try {
			if (!form.title || !form.status || !form.operationType) {
				setError('Completa los campos obligatorios');
				setLoading(false);
				return;
			}
			// Validar campos numéricos
			const numericFields = ['builtSquareMeters', 'landSquareMeters', 'parkingSpaces', 'floors', 'bedrooms', 'bathrooms', 'constructionYear'];
			for (const field of numericFields) {
				let num;
				if (['builtSquareMeters', 'landSquareMeters', 'constructionYear'].includes(field)) {
					// Estos campos vienen como string de TextField type="number"
					num = parseFloat(form[field]);
					if (isNaN(num) || num < 0) {
						setError(`El campo ${field} debe tener un valor válido`);
						setLoading(false);
						return;
					}
				} else {
					// Estos campos vienen como number de NumberStepper
					num = form[field];
					if (num === undefined || num === null || num < 0) {
						setError(`El campo ${field} debe tener un valor válido`);
						setLoading(false);
						return;
					}
				}
				if (field === 'constructionYear' && (num < 1800 || num > new Date().getFullYear())) {
					setError(`El año de construcción debe estar entre 1800 y ${new Date().getFullYear()}`);
					setLoading(false);
					return;
				}
			}
			await onSave(form);
			setStepErrors({}); // Clear all step errors on success
			setLoading(false);
			onClose();
		} catch (e) {
			setError('Error al guardar');
			setLoading(false);
		}
	};

	const [stepErrors, setStepErrors] = useState<Record<number, string[]>>({});

	// Custom stepper state
	const [activeStep, setActiveStep] = useState(0);

	const validateStep = (stepIndex: number): boolean => {
		const currentStep = steps[stepIndex];
		const errors: string[] = [];
		
		// Skip operationType validation if provided as prop
		const fieldsToValidate = currentStep.fields.filter(field => 
			!(field.name === 'operationType' && operationType)
		);

		for (const field of fieldsToValidate) {
			if (field.required) {
				const value = form[field.name];
				
				// Check if field is empty
				if (value === undefined || value === null || value === '') {
					errors.push(`${field.label} es obligatorio`);
					continue;
				}
				
				// Special validations for specific field types
				if (field.name === 'builtSquareMeters' || field.name === 'landSquareMeters') {
					const num = parseFloat(value);
					if (isNaN(num) || num <= 0) {
						errors.push(`${field.label} debe ser un número mayor a 0`);
					}
				}
				
				if (field.name === 'constructionYear') {
					const num = parseFloat(value);
					if (isNaN(num) || num < 1800 || num > new Date().getFullYear()) {
						errors.push(`${field.label} debe estar entre 1800 y ${new Date().getFullYear()}`);
					}
				}
				
				if (field.name === 'price' && !value) {
					errors.push(`${field.label} es obligatorio`);
				}
			}
		}
		
		setStepErrors(prev => ({ ...prev, [stepIndex]: errors }));
		return errors.length === 0;
	};

	const handleNextStep = () => {
		if (validateStep(activeStep)) {
			setActiveStep(activeStep + 1);
		}
	};

	const handlePrevStep = () => {
		setActiveStep(activeStep - 1);
		// Clear errors when going back
		setStepErrors(prev => ({ ...prev, [activeStep]: [] }));
	};

	// Helper to get options for each field
	const getFieldOptions = (fieldName: string) => {
		switch (fieldName) {
			case 'status':
				return PROPERTY_STATUSES;
			case 'operationType':
				return OPERATION_TYPES;
			case 'currencyPrice':
				return CURRENCY_TYPES;
			case 'propertyTypeId':
				return propertyTypes;
			case 'assignedAgentId':
				return agents;
			case 'state':
				return regiones;
			case 'city':
				return filteredComunas || []; // Asegurarse de que siempre sea un array
			default:
				return [];
		}
	};

	// Helper to render fields for current step
	const renderFields = (fields: any[]) => {
		// Special handling for step 2 (location) - combine state and city in same row
		if (activeStep === 1) {
			const renderedFields: React.JSX.Element[] = [];
			let i = 0;
			let keyIndex = 0;

			while (i < fields.length) {
				const field = fields[i];

				// Skip operationType if provided as prop
				if (field.name === 'operationType' && operationType) {
					i++;
					continue;
				}

				// Check if current field is 'state' and next is 'city'
				if (field.name === 'state' && i + 1 < fields.length && fields[i + 1].name === 'city') {
					// Render state and city in same row
					const stateField = field;
					const cityField = fields[i + 1];

					const stateOptions = [...getFieldOptions(stateField.name)];
					const cityOptions = [...getFieldOptions(cityField.name)];

					renderedFields.push(
						<div key={`state-city-row-${keyIndex}`} className="flex gap-4">
							<div className="flex-1">
								<AutoComplete
									options={stateOptions}
									label={stateField.label || 'Buscar'}
									placeholder={stateField.label || 'Buscar'}
									value={form[stateField.name] || null}
									onChange={(val: any) => handleChange(stateField.name, val)}
								/>
							</div>
							<div className="flex-1">
								<AutoComplete
									options={cityOptions}
									label={cityField.label || 'Buscar'}
									placeholder={cityField.label || 'Buscar'}
									value={form[cityField.name] || null}
									onChange={(val: any) => handleChange(cityField.name, val)}
								/>
							</div>
						</div>
					);
					i += 2; // Skip both fields
					keyIndex++;
				} else {
					// Render single field normally
					const fieldOptions = getFieldOptions(field.name);
					const options = fieldOptions.length > 0 ? fieldOptions : (field.options || []);

					if (field.name === 'multimedia') {
						renderedFields.push(
							<div key={`${field.name}-${keyIndex}`}>
								<div className="flex items-center justify-end gap-3 mb-4">
									<IconButton
										icon="add"
										variant="containedSecondary"
										onClick={() => {
											const fileInput = document.getElementById('multimedia-file-input') as HTMLInputElement;
											fileInput?.click();
										}}
										aria-label="Agregar multimedia"
										className="w-12 h-12 rounded-full flex items-center justify-center"
									/>
								</div>
								<div style={{ minHeight: '400px' }}>
									<MultimediaGallery
										uploadPath="/uploads/properties"
										onChange={(files) => {
											console.log('Archivos multimedia seleccionados:', files);
											handleChange(field.name, files);
										}}
										maxFiles={20}
									/>
								</div>
							</div>
						);
					} else {
						let fieldElement: React.JSX.Element | null = null;

						switch (field.type) {
							case 'text':
								fieldElement = (
									<TextField
										label={field.label || 'Campo'}
										placeholder={field.label || 'Campo'}
										value={form[field.name] || ''}
										required={field.required}
										onChange={e => handleChange(field.name, e.target.value)}
									/>
								);
								break;
							case 'textarea':
								fieldElement = (
									<TextField
										label={field.label || 'Campo'}
										value={form[field.name] || ''}
										required={field.required}
										rows={field.rows}
										onChange={e => handleChange(field.name, e.target.value)}
									/>
								);
								break;
							case 'autocomplete':
								fieldElement = (
									<AutoComplete
										options={options}
										label={field.label || 'Buscar'}
										placeholder={field.label || 'Buscar'}
										value={form[field.name] || null}
										onChange={(val: any) => handleChange(field.name, val)}
									/>
								);
								break;
							case 'location':
								fieldElement = (
									<CreateLocationPicker
										onChange={val => handleChange(field.name, val)}
									/>
								);
								break;
							default:
								fieldElement = null;
						}

						if (fieldElement) {
							renderedFields.push(
								<div key={`${field.name}-${keyIndex}`} className="w-full">
									{fieldElement}
								</div>
							);
						}
					}
					i++;
					keyIndex++;
				}
			}

			return (
				<div className="flex flex-col gap-1 h-full overflow-y-auto px-1">
					{loadingOptions && (
						<div className="flex justify-center py-4">
							<DotProgress />
						</div>
					)}
					{renderedFields}
				</div>
			);
		}

		// Special handling for step 3 (characteristics) - use NumberStepper for numeric fields
		if (activeStep === 2) {
			return (
				<div className="flex flex-col gap-1 h-full overflow-y-auto px-1">
					{loadingOptions && (
						<div className="flex justify-center py-4">
							<DotProgress />
						</div>
					)}
					{fields.map((field, idx) => {
						// Skip operationType if provided as prop
						if (field.name === 'operationType' && operationType) {
							return null;
						}

						// Use NumberStepper for bedrooms, bathrooms, parkingSpaces, floors
						// Use TextField type="number" for builtSquareMeters, landSquareMeters, constructionYear
						if (['bedrooms', 'bathrooms', 'parkingSpaces', 'floors'].includes(field.name)) {
							return (
								<div key={`${field.name}-${idx}`} className="w-full">
									<NumberStepper
										label={field.label || 'Campo'}
										value={form[field.name] || 0}
										onChange={(value) => handleChange(field.name, value)}
										min={0}
										max={field.name === 'floors' ? 50 : 20}
										step={1}
										required={field.required}
									/>
								</div>
							);
						} else if (['builtSquareMeters', 'landSquareMeters', 'constructionYear'].includes(field.name)) {
							return (
								<div key={`${field.name}-${idx}`} className="w-full">
									<TextField
										label={field.label || 'Campo'}
										type="number"
										value={form[field.name]?.toString() || ''}
										onChange={e => handleChange(field.name, e.target.value)}
										required={field.required}
									/>
								</div>
							);
						}

						// Default rendering for other fields
						const fieldOptions = getFieldOptions(field.name);
						const options = fieldOptions.length > 0 ? fieldOptions : (field.options || []);

						switch (field.type) {
							case 'number':
								if (field.name === 'constructionYear') {
									return (
										<div key={`${field.name}-${idx}`} className="w-full">
											<NumberStepper
												label={field.label || 'Campo'}
												value={form[field.name] || 0}
												onChange={(value) => handleChange(field.name, value)}
												min={1800}
												max={new Date().getFullYear()}
												step={1}
												required={field.required}
											/>
										</div>
									);
								} else {
									return (
										<div key={`${field.name}-${idx}`} className="w-full">
											<TextField
												label={field.label || 'Campo'}
												type="number"
												value={form[field.name]?.toString() || '0'}
												onChange={e => handleChange(field.name, e.target.value)}
												required={field.required}
											/>
										</div>
									);
								}
							case 'text':
								return (
									<div key={`${field.name}-${idx}`} className="w-full">
										<TextField
											label={field.label || 'Campo'}
											placeholder={field.label || 'Campo'}
											value={form[field.name] || ''}
											required={field.required}
											onChange={e => handleChange(field.name, e.target.value)}
										/>
									</div>
								);
							default:
								return null;
						}
					})}
				</div>
			);
		}

		// Default rendering for other steps
		return (
			<div className="flex flex-col gap-1 h-full overflow-y-auto px-1">
				{loadingOptions && (
					<div className="flex justify-center py-4">
						<DotProgress />
					</div>
				)}
				{fields.map((field, idx) => {
					// Ocultar operationType si viene como prop
					if (field.name === 'operationType' && operationType) {
						return null;
					}

					// Get field-specific options or use field.options as fallback
					const fieldOptions = getFieldOptions(field.name);
					const options = fieldOptions.length > 0 ? fieldOptions : (field.options || []);
					if (field.name === 'multimedia') {
						// Implementación igual a FullProperty
						return (
							<div key={`${field.name}-${idx}`}>
								<div className="flex items-center justify-end gap-3 mb-4">
									<IconButton
										icon="add"
										variant="containedSecondary"
										onClick={() => {
											// Trigger file input click from MultimediaGallery
											const fileInput = document.getElementById('multimedia-file-input') as HTMLInputElement;
											fileInput?.click();
										}}
										aria-label="Agregar multimedia"
										className="w-12 h-12 rounded-full flex items-center justify-center"
									/>
								</div>
								<div style={{ minHeight: '400px' }}>
									<MultimediaGallery
										uploadPath="/uploads/properties"
										onChange={(files) => {
											console.log('Archivos multimedia seleccionados:', files);
											handleChange(field.name, files);
										}}
										maxFiles={20}
									/>
								</div>
							</div>
						);
					}
					// Otros campos
					switch (field.type) {
						case 'text':
							return (
								<div key={`${field.name}-${idx}`} className="w-full">
									<TextField
										label={field.label || 'Campo'}
										placeholder={field.label || 'Campo'}
										value={form[field.name] || ''}
										required={field.required}
										onChange={e => handleChange(field.name, e.target.value)}
									/>
								</div>
							);
						case 'textarea':
							return (
								<div key={`${field.name}-${idx}`} className="w-full">
									<TextField
										label={field.label || 'Campo'}
										value={form[field.name] || ''}
										required={field.required}
										rows={field.rows}
										onChange={e => handleChange(field.name, e.target.value)}
									/>
								</div>
							);
						case 'number':
							if (field.name === 'constructionYear') {
								return (
									<div key={`${field.name}-${idx}`} className="w-full">
										<TextField
											label={field.label || 'Campo'}
											type="datePicker"
											value={form[field.name]?.toString() || ''}
											onChange={e => handleChange(field.name, e.target.value)}
											required={field.required}
										/>
									</div>
								);
							} else {
								return (
									<div key={`${field.name}-${idx}`} className="w-full">
										<TextField
											label={field.label || 'Campo'}
											type="number"
											value={form[field.name]?.toString() || '0'}
											onChange={e => handleChange(field.name, e.target.value)}
											required={field.required}
										/>
									</div>
								);
							}
						case 'select':
							return (
								<div key={`${field.name}-${idx}`} className="w-full">
									<Select
										options={options}
										placeholder={field.label || 'Selecciona'}
										value={form[field.name] || null}
										required={field.required}
										onChange={(val: any) => handleChange(field.name, val)}
									/>
								</div>
							);
						case 'autocomplete':
							return (
								<div key={`${field.name}-${idx}`} className="w-full">
									<AutoComplete
										options={options}
										label={field.label || 'Buscar'}
										placeholder={field.label || 'Buscar'}
										value={form[field.name] || null}
										onChange={(val: any) => handleChange(field.name, val)}
									/>
								</div>
							);
						case 'location':
							return (
								<div key={`${field.name}-${idx}`} className="w-full">
									<CreateLocationPicker
										onChange={val => handleChange(field.name, val)}
									/>
								</div>
							);
						case 'currency':
							return (
								<div key={`${field.name}-${idx}`} className="w-full">
									<TextField
										label={field.label || 'Precio'}
										placeholder={field.label || 'Precio'}
										type="currency"
										value={form[field.name] || ''}
										onChange={e => handleChange(field.name, e.target.value)}
									/>
								</div>
							);
						case 'file':
							return (
								<div key={`${field.name}-${idx}`} className="w-full">
									<FileImageUploader
										uploadPath="/uploads/properties"
										onChange={val => handleChange(field.name, val)}
										label={field.label || 'Imágenes'}
									/>
								</div>
							);
						default:
							return null;
					}
				})}
			</div>
		);
	};

	// Stepper visual mejorado
	const renderStepper = () => (
		<div className="w-full">
			{/* Círculos del stepper y botones en la misma fila */}
			<div className="flex items-center justify-between gap-2 mb-3">
				{/* Círculos del stepper - alineados a la izquierda */}
				<div className="flex items-center gap-2">
					{steps.map((step, idx) => (
						<button
							key={`${step.title}-${idx}`}
							type="button"
							className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-150 text-xs
								${activeStep === idx 
									? 'bg-primary border-primary text-white' 
									: idx < activeStep 
									? 'bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed opacity-60' 
									: 'bg-background border-secondary text-secondary hover:bg-muted'
								}`}
							onClick={() => setActiveStep(idx)}
							aria-label={`Ir a paso ${step.title}`}
							disabled={idx < activeStep}
						>
							{idx + 1}
						</button>
					))}
				</div>

				{/* Botones de navegación alineados a la derecha */}
				<div className="flex items-center gap-2">
					{activeStep > 0 && (
						<Button variant="secondary" onClick={handlePrevStep}>
							Atrás
						</Button>
					)}
					{activeStep < steps.length - 1 ? (
						<Button variant="primary" onClick={handleNextStep}>
							Siguiente
						</Button>
					) : (
						<Button variant="primary" onClick={handleSubmit} disabled={loading}>
							{loading ? 'Guardando...' : 'Guardar'}
						</Button>
					)}
				</div>
			</div>			{/* Card del paso activo - 100% del ancho */}
			<div className="w-full mb-3">
				<div className="rounded-lg p-4 border-l-4 border-secondary border-t border-b border-r border-border shadow-lg">
					<div className="flex items-center gap-1">
						{/* Título y descripción */}
						<div className="flex-1">
							<h3 className="text-lg font-semibold text-foreground mb-1">
								{steps[activeStep].title}
							</h3>
							<p className="text-xs text-muted-foreground leading-relaxed">
								{steps[activeStep].description}
							</p>
						</div>

						{/* Número del paso */}
						<div className="flex-shrink-0">
							<div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-lg">
								{activeStep + 1}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	// Navigation buttons
	const renderNavButtons = () => (
		<div className="flex justify-end items-center gap-2">
			{activeStep > 0 && (
				<Button variant="secondary" onClick={() => setActiveStep(activeStep - 1)}>
					Atrás
				</Button>
			)}
			{activeStep < steps.length - 1 ? (
				<Button variant="primary" onClick={() => setActiveStep(activeStep + 1)}>
					Siguiente
				</Button>
			) : (
				<Button variant="primary" onClick={handleSubmit} disabled={loading}>
					{loading ? 'Guardando...' : 'Guardar'}
				</Button>
			)}
		</div>
	);

	return (
		<div className="w-full max-w-3xl lg:w-[800px] xl:w-[800px] mx-auto flex flex-col h-full min-h-[600px] relative">
			{/* Header fijo - Stepper mejorado */}
			<div className="flex-shrink-0">
				{renderStepper()}
				{error && <Alert variant="error" className="mb-4">{error}</Alert>}
				{stepErrors[activeStep] && stepErrors[activeStep].length > 0 && (
					<Alert variant="error" className="mb-4">
						<div className="font-semibold mb-2">Campos obligatorios faltantes:</div>
						<ul className="list-disc list-inside space-y-1">
							{stepErrors[activeStep].map((errorMsg, idx) => (
								<li key={idx} className="text-sm">{errorMsg}</li>
							))}
						</ul>
					</Alert>
				)}
			</div>
			
			{/* Contenido con altura fija - cada step maneja su propio scroll */}
			<div className="flex-1 min-h-0">
				{renderFields(steps[activeStep].fields)}
			</div>
			
			{/* Loading centrado absolutamente */}
			{loading && (
				<div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
					<DotProgress />
				</div>
			)}
		</div>
	);
}
