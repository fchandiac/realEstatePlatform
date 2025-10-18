'use client'
import React, { useState } from 'react';
import CreateBaseForm, { BaseFormField } from './CreateBaseForm';
import UpdateBaseForm from './UpdateBaseForm';
import DeleteBaseForm from './DeleteBaseForm';
import StepperBaseForm, { StepperStep } from './StepperBaseForm';
import Link from 'next/link';

export default function BaseFormShowcase() {
  const [createFormData, setCreateFormData] = useState<Record<string, any>>({
    name: '',
    email: '',
    age: '',
    country: null,
    active: false,
    salary: 50000,
    description: '',
    location: null,
    department: null,
  });

  const [updateFormData, setUpdateFormData] = useState<Record<string, any>>({
    name: 'Juan Pérez',
    email: 'juan@example.com',
    age: '30',
    country: 1,
    active: true,
    salary: 75000,
    description: 'Usuario existente con datos completos',
    location: { lat: -34.6037, lng: -58.3816 },
    department: 2,
  });

  const [deleteFormData, setDeleteFormData] = useState<Record<string, any>>({
    confirmText: '',
  });

  const [stepperFormData, setStepperFormData] = useState<Record<string, any>>({
    // Paso 1: Información Personal
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Paso 2: Información Profesional
    jobTitle: '',
    department: null,
    experience: '',
    salary: 50000,
    // Paso 3: Información Adicional
    address: '',
    city: '',
    country: null,
    bio: '',
    skills: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const countries: { id: number; label: string }[] = [
    { id: 1, label: 'Argentina' },
    { id: 2, label: 'Brasil' },
    { id: 3, label: 'Chile' },
    { id: 4, label: 'Colombia' },
    { id: 5, label: 'México' },
  ];

  const departments: { id: number; label: string }[] = [
    { id: 1, label: 'Ventas' },
    { id: 2, label: 'Marketing' },
    { id: 3, label: 'Desarrollo' },
    { id: 4, label: 'Soporte' },
    { id: 5, label: 'Administración' },
  ];

  const stepperSteps: StepperStep[] = [
    {
      title: 'Información Personal',
      description: 'Complete sus datos personales básicos',
      fields: [
        {
          name: 'firstName',
          label: 'Nombre',
          type: 'text',
          required: true,
          col: 1,
        },
        {
          name: 'lastName',
          label: 'Apellido',
          type: 'text',
          required: true,
          col: 2,
        },
        {
          name: 'email',
          label: 'Correo electrónico',
          type: 'email',
          required: true,
          col: 1,
        },
        {
          name: 'phone',
          label: 'Teléfono',
          type: 'text',
          required: true,
          col: 2,
        },
      ],
    },
    {
      title: 'Información Profesional',
      description: 'Detalles sobre su experiencia laboral',
      fields: [
        {
          name: 'jobTitle',
          label: 'Cargo',
          type: 'text',
          required: true,
          col: 1,
        },
        {
          name: 'department',
          label: 'Departamento',
          type: 'select',
          options: departments,
          required: true,
          col: 2,
        },
        {
          name: 'experience',
          label: 'Años de experiencia',
          type: 'number',
          required: true,
          col: 1,
        },
        {
          name: 'salary',
          label: 'Salario esperado',
          type: 'currency',
          required: true,
          col: 2,
        },
      ],
    },
    {
      title: 'Información Adicional',
      description: 'Información complementaria y ubicación',
      fields: [
        {
          name: 'address',
          label: 'Dirección',
          type: 'text',
          required: true,
          col: 1,
        },
        {
          name: 'city',
          label: 'Ciudad',
          type: 'text',
          required: true,
          col: 2,
        },
        {
          name: 'country',
          label: 'País',
          type: 'autocomplete',
          options: countries,
          required: true,
          col: 1,
        },
        {
          name: 'bio',
          label: 'Biografía',
          type: 'textarea',
          multiline: true,
          rows: 3,
          col: 2,
        },
      ],
    },
  ];

  const createFields: BaseFormField[] = [
    {
      name: 'name',
      label: 'Nombre completo',
      type: 'text',
      required: true,
      col: 1,
    },
    {
      name: 'email',
      label: 'Correo electrónico',
      type: 'email',
      required: true,
      col: 1,
    },
    {
      name: 'age',
      label: 'Edad',
      type: 'number',
      required: true,
      col: 2,
    },
    {
      name: 'country',
      label: 'País',
      type: 'autocomplete',
      options: countries,
      required: true,
      col: 2,
    },
    {
      name: 'department',
      label: 'Departamento',
      type: 'select',
      options: departments,
      col: 1,
    },
    {
      name: 'salary',
      label: 'Salario',
      type: 'currency',
      col: 2,
    },
    {
      name: 'active',
      label: 'Usuario activo',
      type: 'switch',
      col: 1,
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea',
      multiline: true,
      rows: 3,
      col: 1,
    },
    {
      name: 'location',
      label: 'Ubicación',
      type: 'location',
      col: 2,
    },
  ];

  const updateFields: BaseFormField[] = [
    {
      name: 'name',
      label: 'Nombre completo',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      label: 'Correo electrónico',
      type: 'email',
      required: true,
    },
    {
      name: 'country',
      label: 'País',
      type: 'autocomplete',
      options: countries,
      required: true,
    },
    {
      name: 'active',
      label: 'Usuario activo',
      type: 'switch',
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea',
      multiline: true,
      rows: 3,
    },
  ];

  const deleteFields: BaseFormField[] = [
    {
      name: 'confirmText',
      label: 'Escribe "ELIMINAR" para confirmar',
      type: 'text',
      required: true,
    },
  ];

  const handleCreateSubmit = async () => {
    setIsSubmitting(true);
    setErrors([]);

    // Simular validación
    const newErrors: string[] = [];
    if (!createFormData.name) newErrors.push('El nombre es requerido');
    if (!createFormData.email) newErrors.push('El email es requerido');
    if (!createFormData.country) newErrors.push('El país es requerido');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    // Simular API call
    setTimeout(() => {
      alert('Usuario creado exitosamente!');
      setIsSubmitting(false);
      // Reset form
      setCreateFormData({
        name: '',
        email: '',
        age: '',
        country: null,
        active: false,
        salary: 50000,
        description: '',
        location: null,
        department: null,
      });
    }, 2000);
  };

  const handleUpdateSubmit = async () => {
    setIsSubmitting(true);
    setErrors([]);

    // Simular API call
    setTimeout(() => {
      alert('Usuario actualizado exitosamente!');
      setIsSubmitting(false);
    }, 1500);
  };

  const handleDeleteSubmit = async () => {
    if (deleteFormData.confirmText !== 'ELIMINAR') {
      setErrors(['Debes escribir "ELIMINAR" para confirmar']);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    // Simular API call
    setTimeout(() => {
      alert('Usuario eliminado exitosamente!');
      setIsSubmitting(false);
      setDeleteFormData({ confirmText: '' });
    }, 1000);
  };

  const handleStepperSubmit = async () => {
    setIsSubmitting(true);
    setErrors([]);

    // Simular validación
    const newErrors: string[] = [];
    if (!stepperFormData.firstName) newErrors.push('El nombre es requerido');
    if (!stepperFormData.lastName) newErrors.push('El apellido es requerido');
    if (!stepperFormData.email) newErrors.push('El email es requerido');
    if (!stepperFormData.jobTitle) newErrors.push('El cargo es requerido');
    if (!stepperFormData.department) newErrors.push('El departamento es requerido');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    // Simular API call
    setTimeout(() => {
      alert('Usuario registrado exitosamente!');
      setIsSubmitting(false);
      // Reset form
      setStepperFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        jobTitle: '',
        department: null,
        experience: '',
        salary: 50000,
        address: '',
        city: '',
        country: null,
        bio: '',
        skills: [],
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/components" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver a Componentes
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">BaseForm Component</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Sistema de formularios genérico y reutilizable que soporta múltiples tipos de campos,
            layouts responsivos en columnas, validación integrada, estados de carga y operaciones CRUD.
            Perfecto para crear interfaces de usuario consistentes y mantenibles.
          </p>
        </div>

        {/* Create Form Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Formulario de Creación (2 Columnas)</h2>
          <CreateBaseForm
            fields={createFields}
            values={createFormData}
            onChange={(field, value) => setCreateFormData(prev => ({ ...prev, [field]: value }))}
            onSubmit={handleCreateSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Crear Usuario"
            title="Nuevo Usuario"
            subtitle="Complete los datos para crear un nuevo usuario en el sistema"
            errors={errors}
            columns={2}
            data-test-id="create-user-form"
          />
        </div>

        {/* Update Form Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Formulario de Actualización</h2>
          <UpdateBaseForm
            fields={updateFields}
            initialState={updateFormData}
            onSubmit={(values) => {
              setUpdateFormData(values);
              handleUpdateSubmit();
            }}
            isSubmitting={isSubmitting}
            submitLabel="Actualizar Usuario"
            title="Editar Usuario"
            subtitle="Modifique los datos del usuario seleccionado"
            errors={errors}
            data-test-id="update-user-form"
          />
        </div>

        {/* Delete Form Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Formulario de Eliminación</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-red-600 text-lg">⚠️</span>
              <p className="text-red-800 font-medium">Acción Destructiva</p>
            </div>
            <p className="text-red-700 text-sm mt-1">
              Esta acción eliminará permanentemente al usuario Juan Pérez y todos sus datos asociados.
            </p>
          </div>
          <DeleteBaseForm
            message="¿Estás seguro de que deseas eliminar al usuario Juan Pérez? Esta acción no se puede deshacer y eliminará permanentemente todos los datos asociados al usuario."
            onSubmit={handleDeleteSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Eliminar Usuario"
            title="Confirmar Eliminación"
            subtitle="Esta acción es irreversible"
            errors={errors}
            data-test-id="delete-user-form"
          />
        </div>

        {/* Stepper Form Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Formulario Stepper (Multi-paso)</h2>
          <p className="text-gray-600 mb-6">
            Formulario dividido en múltiples pasos con navegación intuitiva, validación por paso y resumen final.
            Ideal para formularios largos o procesos complejos.
          </p>
          <StepperBaseForm
            steps={stepperSteps}
            values={stepperFormData}
            onChange={(field, value) => setStepperFormData(prev => ({ ...prev, [field]: value }))}
            onSubmit={handleStepperSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Registrar Usuario"
            title="Registro de Nuevo Usuario"
            subtitle="Complete el formulario paso a paso"
            errors={errors}
            columns={2}
            data-test-id="stepper-user-form"
          />
        </div>

        {/* Single Column Example */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Formulario de Una Columna</h2>
          <CreateBaseForm
            fields={createFields.slice(0, 4)} // Solo primeros 4 campos
            values={createFormData}
            onChange={(field, value) => setCreateFormData(prev => ({ ...prev, [field]: value }))}
            onSubmit={() => alert('Formulario enviado!')}
            submitLabel="Enviar"
            title="Formulario Simple"
            columns={1}
            data-test-id="single-column-form"
          />
        </div>

        {/* Field Types Demo */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tipos de Campos Soportados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Campos de Texto</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• <strong>text:</strong> Campo de texto simple</div>
                <div>• <strong>textarea:</strong> Área de texto multilinea</div>
                <div>• <strong>email:</strong> Campo con validación de email</div>
                <div>• <strong>password:</strong> Campo de contraseña</div>
                <div>• <strong>number:</strong> Campo numérico</div>
                <div>• <strong>dni:</strong> Campo formateado para DNI</div>
                <div>• <strong>currency:</strong> Campo monetario</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Campos de Selección</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• <strong>autocomplete:</strong> Búsqueda con autocompletado</div>
                <div>• <strong>select:</strong> Lista desplegable</div>
                <div>• <strong>switch:</strong> Interruptor booleano</div>
                <div>• <strong>range:</strong> Control deslizante de rango</div>
                <div>• <strong>location:</strong> Selector de ubicación geográfica</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Características</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• <strong>Layout responsivo:</strong> Múltiples columnas</div>
                <div>• <strong>Validación:</strong> Campos requeridos</div>
                <div>• <strong>Loading states:</strong> Indicadores de carga</div>
                <div>• <strong>Errores:</strong> Manejo de errores integrado</div>
                <div>• <strong>Testing:</strong> data-test-id en todos los campos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ejemplos de Uso</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Formulario de Creación Básico</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import CreateBaseForm, { BaseFormField } from './components/BaseForm/CreateBaseForm';

const fields: BaseFormField[] = [
  { name: 'name', label: 'Nombre', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'active', label: 'Activo', type: 'switch' }
];

function CreateUserForm() {
  const [values, setValues] = useState({});

  return (
    <CreateBaseForm
      fields={fields}
      values={values}
      onChange={(field, value) => setValues(prev => ({ ...prev, [field]: value }))}
      onSubmit={handleSubmit}
      title="Nuevo Usuario"
      submitLabel="Crear"
    />
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Formulario con Múltiples Columnas</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<CreateBaseForm
  fields={fields}
  values={values}
  onChange={handleChange}
  onSubmit={handleSubmit}
  columns={2}
  title="Formulario en Dos Columnas"
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Campos con Opciones</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`const fields: BaseFormField[] = [
  {
    name: 'country',
    label: 'País',
    type: 'autocomplete',
    options: [
      { id: 1, label: 'Argentina' },
      { id: 2, label: 'Brasil' }
    ],
    required: true
  },
  {
    name: 'department',
    label: 'Departamento',
    type: 'select',
    options: departments,
    col: 2 // Posiciona en columna 2
  }
];`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Formulario Stepper (Multi-paso)</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import StepperBaseForm, { StepperStep } from './components/BaseForm/StepperBaseForm';

const steps: StepperStep[] = [
  {
    title: 'Información Personal',
    description: 'Complete sus datos personales básicos',
    fields: [
      { name: 'firstName', label: 'Nombre', type: 'text', required: true },
      { name: 'lastName', label: 'Apellido', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true }
    ]
  },
  {
    title: 'Información Profesional',
    description: 'Detalles sobre su experiencia laboral',
    fields: [
      { name: 'jobTitle', label: 'Cargo', type: 'text', required: true },
      { name: 'department', label: 'Departamento', type: 'select', options: departments }
    ]
  }
];

function MultiStepForm() {
  const [values, setValues] = useState({});

  return (
    <StepperBaseForm
      steps={steps}
      values={values}
      onChange={(field, value) => setValues(prev => ({ ...prev, [field]: value }))}
      onSubmit={handleSubmit}
      title="Registro de Usuario"
      submitLabel="Registrar"
      columns={2}
    />
  );
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Props Reference Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Referencia de Props</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Prop</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Tipo</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Por defecto</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">fields</td>
                  <td className="px-4 py-2 text-sm text-gray-600">BaseFormField[]</td>
                  <td className="px-4 py-2 text-sm text-gray-600">requerido</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Array de campos del formulario</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">values</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Record&lt;string, any&gt;</td>
                  <td className="px-4 py-2 text-sm text-gray-600">requerido</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Objeto con los valores actuales</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">onChange</td>
                  <td className="px-4 py-2 text-sm text-gray-600">(field: string, value: any) =&gt; void</td>
                  <td className="px-4 py-2 text-sm text-gray-600">requerido</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Callback cuando cambia un campo</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">onSubmit</td>
                  <td className="px-4 py-2 text-sm text-gray-600">() =&gt; void</td>
                  <td className="px-4 py-2 text-sm text-gray-600">requerido</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Función ejecutada al enviar</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">isSubmitting</td>
                  <td className="px-4 py-2 text-sm text-gray-600">boolean</td>
                  <td className="px-4 py-2 text-sm text-gray-600">false</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Estado de carga del formulario</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">submitLabel</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">&quot;Guardar&quot;</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Texto del botón de envío</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">title</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">&quot;&quot;</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Título del formulario</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">subtitle</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">&quot;&quot;</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Subtítulo del formulario</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">errors</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string[]</td>
                  <td className="px-4 py-2 text-sm text-gray-600">[]</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Array de mensajes de error</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">columns</td>
                  <td className="px-4 py-2 text-sm text-gray-600">number</td>
                  <td className="px-4 py-2 text-sm text-gray-600">1</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Número de columnas del layout</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono text-blue-600">data-test-id</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">undefined</td>
                  <td className="px-4 py-2 text-sm text-gray-600">ID para testing automatizado</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">🎯 Tipos de Campo Soportados</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-700">
                <div>• text</div>
                <div>• textarea</div>
                <div>• email</div>
                <div>• password</div>
                <div>• number</div>
                <div>• dni</div>
                <div>• currency</div>
                <div>• autocomplete</div>
                <div>• select</div>
                <div>• switch</div>
                <div>• range</div>
                <div>• location</div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-semibold text-green-800 mb-2">⚡ Variantes del Componente</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li><strong>CreateBaseForm:</strong> Para formularios de creación con layout flexible</li>
                <li><strong>UpdateBaseForm:</strong> Para formularios de edición con datos pre-cargados</li>
                <li><strong>DeleteBaseForm:</strong> Para confirmaciones de eliminación con validación adicional</li>
                <li><strong>StepperBaseForm:</strong> Para formularios multi-paso con navegación intuitiva</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-sm font-semibold text-purple-800 mb-2">🔧 Características Avanzadas</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li><strong>Layout responsivo:</strong> Sistema de columnas automático</li>
                <li><strong>Validación integrada:</strong> Campos requeridos y formatos específicos</li>
                <li><strong>Estados de carga:</strong> Indicadores visuales durante el envío</li>
                <li><strong>Manejo de errores:</strong> Display de errores con componentes Alert</li>
                <li><strong>Testing friendly:</strong> data-test-id en todos los elementos</li>
                <li><strong>Formatters:</strong> Funciones personalizadas para formateo de input</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}