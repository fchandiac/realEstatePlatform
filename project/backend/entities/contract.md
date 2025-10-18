# 🧾 Contract Entity

Entidad que representa los contratos de **venta o arriendo** en el sistema.  
Incluye fechas clave, montos, unidad de cuenta (UF/CLP), personas asociadas, historial de cambios y relaciones con propiedades, usuarios, documentos y pagos.

---

## 📘 Tabla: `contracts`

| **Campo** | **Tipo** | **Nulable** | **Descripción** |
|-----------|----------|-------------|----------------|
| `id` | `uuid` (PK) | ❌ | Identificador único del contrato |
| `type` | `enum('SALE', 'RENTAL')` | ❌ | Tipo de contrato (venta o arriendo) |
| `status` | `enum('DRAFT', 'PENDING', 'SIGNED', 'COMPLETED', 'CANCELLED')` | ✅ (por defecto `DRAFT`) | Estado actual del contrato |
| `amount` | `decimal(15,2)` | ❌ | Monto total del contrato |
| `unitAmount` | `enum('UF', 'CLP')` | ❌ | Unidad del monto (UF o CLP) |
| `commissionAmount` | `decimal(15,2)` | ✅ (default 0) | Monto de comisión asociado al contrato |
| `startDate` | `date` | ✅ | Fecha de inicio del proceso o vigencia contractual |
| `endDate` | `date` | ✅ | Fecha de término del contrato |
| `signatureDate` | `date` | ✅ | Fecha de firma del contrato |
| `rentalDurationMonths` | `int` | ✅ | Duración del contrato de arriendo en meses |
| `paymentDayOfMonth` | `int` | ✅ | Día del mes en que se realiza el pago del arriendo (1–31) |
| `people` | `json` | ✅ | Personas asociadas al contrato y sus roles. Ejemplo: `[{"personId": "uuid", "role": "TENANT"}]` |
| `notes` | `text` | ✅ | Notas o comentarios internos |
| `propertyId` | `uuid` (FK) | ❌ | ID de la propiedad asociada |
| `deletedAt` | `timestamp` | ✅ | Fecha de eliminación lógica (soft delete) |
| `createdAt` | `timestamp` | ❌ | Fecha de creación del registro |
| `updatedAt` | `timestamp` | ❌ | Última actualización del registro |
| `history` | `json` | ✅ | Historial de cambios realizados por usuarios: `{ userId, date, change: { field, oldValue, newValue } }` |

---

## 🔗 Relaciones

| **Relación** | **Tipo** | **Entidad destino** | **Descripción** |
|--------------|----------|-------------------|----------------|
| `property` | `ManyToOne` | `Property` | Propiedad asociada al contrato |
| `documents` | `OneToMany` | `Document` | Documentos vinculados al contrato (PDFs, anexos, etc.) |
| `payments` | `OneToMany` | `Payment` | Pagos asociados al contrato (un pago pertenece a un contrato) |

---

## 🧱 Enums

### `ContractType`
```ts
SALE     // Contrato de venta
RENTAL   // Contrato de arriendo
```

### `ContractStatus`
```ts
DRAFT      // En borrador
PENDING    // Pendiente de firma o aprobación
SIGNED     // Firmado por ambas partes
COMPLETED  // Contrato finalizado
CANCELLED  // Contrato cancelado
```

### `UnitAmount`
```ts
UF   // Unidad de Fomento
CLP  // Peso chileno
```

### `ContractRole`
```ts
SELLER          // Vendedor
BUYER           // Comprador
LANDLORD        // Arrendador
TENANT          // Arrendatario
NOTARY          // Notario / Ministro de Fe
REGISTRAR       // Conservador de Bienes Raíces
WITNESS         // Testigos
GUARANTOR       // Fiador o Aval
REPRESENTATIVE  // Apoderado o Representante
PROMISSOR       // Promitente comprador/vendedor
THIRD_PARTY     // Terceros interesados
AGENT           // Corredor de propiedades
```

---

## 🕓 Auditoría y soft delete

- **`createdAt`** → Fecha de creación automática del registro.  
- **`updatedAt`** → Fecha de la última modificación.  
- **`deletedAt`** → Fecha de eliminación lógica (soft delete).  
- **`history`** → JSON con cambios realizados por usuarios:  
```json
{
  "userId": "uuid",
  "date": "2025-10-16T12:00:00Z",
  "change": {
    "field": "status",
    "oldValue": "DRAFT",
    "newValue": "PENDING"
  }
}
```

---

## 🧩 Ejemplo de uso

```ts
const contract = new Contract();
contract.type = ContractType.RENTAL;
contract.status = ContractStatus.PENDING;
contract.amount = 12.5;
contract.unitAmount = UnitAmount.UF;
contract.commissionAmount = 0;
contract.startDate = new Date('2025-03-01');
contract.endDate = new Date('2026-02-28');
contract.signatureDate = new Date('2025-02-15');
contract.rentalDurationMonths = 12;
contract.paymentDayOfMonth = 5;
contract.people = [
  { personId: 'uuid-tenant', role: 'TENANT' },
  { personId: 'uuid-landlord', role: 'LANDLORD' }
];
contract.propertyId = 'uuid-property';
contract.notes = 'Contrato renovable automáticamente.';
contract.history = [
  { userId: 'uuid-user', date: new Date(), change: { field: 'status', oldValue: 'DRAFT', newValue: 'PENDING' } }
];
```














## Tabla de roles posibles en contratos de arriendo y compraventa en Chile

| Rol                        | Valor ENUM         | Descripción                                                                 | ¿Está regulado explícitamente? | Fuente         |
|----------------------------|--------------------|-----------------------------------------------------------------------------|-------------------------------|----------------|
| Vendedor                   | SELLER             | Parte que se obliga a transferir el dominio de un bien a cambio de un precio.| Sí, Código Civil art. 1793    | BCN Chile: http://www.bcn.cl/leychile/navegar?idNorma=172986 |
| Comprador                  | BUYER              | Parte que se obliga a pagar el precio en dinero por el bien adquirido.       | Sí, Código Civil art. 1793    | BCN Chile: http://www.bcn.cl/leychile/navegar?idNorma=172986 |
| Arrendador                 | LANDLORD           | Propietario o quien cede el uso y goce de un bien a cambio de una renta.     | Sí, Código Civil art. 1915    | BCN Chile: http://www.bcn.cl/leychile/navegar?idNorma=172986 |
| Arrendatario               | TENANT             | Quien recibe el uso o goce del bien y paga la renta.                         | Sí, Código Civil art. 1915    | BCN Chile: http://www.bcn.cl/leychile/navegar?idNorma=172986 |
| Notario / Ministro de Fe   | NOTARY             | Funcionario público que autoriza y da fe de la escritura pública requerida para la compraventa. | Sí, Ley de Notariado y práctica obligatoria para inmuebles. | Vlex Chile: https://vlex.cl     |
| Conservador de Bienes Raíces| REGISTRAR          | Encargado de inscribir la escritura en el registro para perfeccionar la tradición de dominio. | Sí, Código Civil art. 686 y Ley de Registro Conservatorio. | SII Chile: http://www.sii.cl      |
| Testigos                   | WITNESS            | Personas que firman para certificar las firmas o hechos, reforzando la prueba del contrato. | No en todos los casos, pero reconocidos en materia probatoria. | SII Chile: http://www.sii.cl      |
| Fiador o Aval              | GUARANTOR          | Persona que garantiza el cumplimiento de las obligaciones de una de las partes. | Regulación general de fianzas en Código Civil arts. 2335 y ss. | BCN Chile: http://www.bcn.cl/leychile/navegar?idNorma=172986      |
| Apoderado o Representante  | REPRESENTATIVE     | Persona autorizada para actuar en nombre de una de las partes.               | Sí, regulado por normas sobre mandato. | Portal Ijurídica: http://www.portal.ijuridica.cl |
| Promitente comprador/vendedor | PROMISSOR         | Parte de un contrato de promesa que se obliga a celebrar en el futuro una compraventa. | Sí, regulado en Código Civil arts. 1554 y siguientes. | BCN Chile: http://www.bcn.cl/leychile/navegar?idNorma=172986      |
| Terceros interesados (ej. acreedor hipotecario) | THIRD_PARTY        | Persona con derechos reales o gravámenes que pueden afectar la operación. | Sí, regulado por normas sobre hipoteca y gravámenes. | Vlex Chile: https://vlex.cl     |
| Corredor de propiedades    | AGENT              | Intermediario que facilita la operación, aunque no es parte contractual.     | No regulado en Código Civil, pero sí en normativa comercial y costumbre. | Vlex Chile: https://vlex.cl     |








