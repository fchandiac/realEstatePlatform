# Entidad: Payment

## 🧾 Descripción
La entidad **Payment** representa un pago asociado a un contrato específico dentro del sistema inmobiliario.  
Cada pago pertenece a una persona y puede tener múltiples documentos adjuntos como comprobantes.

---

## 🧩 Estructura de la entidad

| Campo | Tipo | Descripción | Relación | Requerido |
|-------|------|--------------|-----------|------------|
| `id` | `uuid` | Identificador único del pago. | — | ✅ |
| `contractId` | `uuid` | Identificador del contrato asociado al pago. | 🔗 `Contract` | ✅ |
| `personId` | `uuid` | Identificador de la persona que realiza el pago. | 🔗 `Person` | ✅ |
| `amount` | `decimal` | Monto del pago realizado. | — | ✅ |
| `currency` | `enum` (`CLP`, `UF`, `USD`) | Moneda en que se realizó el pago. | — | ✅ |
| `paymentDate` | `datetime` | Fecha en que se efectuó el pago. | — | ✅ |
| `status` | `enum` (`PENDING`, `COMPLETED`, `FAILED`, `REFUNDED`) | Estado actual del pago. | — | ✅ |
| `documents` | `Document[]` | Documentos asociados al pago (boletas, comprobantes, etc.). | 🔗 `Document` | ❌ |
| `paymentMethod` | `varchar` | Método de pago utilizado (transferencia, efectivo, tarjeta, etc.). | — | ❌ |
| `referenceNumber` | `varchar` | Número de referencia o comprobante del pago. | — | ❌ |
| `notes` | `text` | Notas internas o comentarios adicionales. | — | ❌ |
| `createdAt` | `datetime` | Fecha de creación del registro. | — | ✅ |
| `updatedAt` | `datetime` | Fecha de última actualización. | — | ✅ |
| `deletedAt` | `datetime` | Fecha de eliminación lógica (si aplica). | — | ❌ |

---

## 🔗 Relaciones
- **Un Payment pertenece a un Contract.**
- **Un Payment pertenece a una Person.**
- **Un Payment puede tener muchos Document asociados.**

---

## 📜 Enumeraciones

### PaymentStatus
| Valor | Descripción |
|--------|--------------|
| `PENDING` | El pago está pendiente de confirmación. |
| `COMPLETED` | El pago se completó exitosamente. |
| `FAILED` | El pago falló o fue rechazado. |
| `REFUNDED` | El pago fue devuelto o reembolsado. |

### Currency
| Valor | Descripción |
|--------|--------------|
| `CLP` | Peso chileno. |
| `UF` | Unidad de Fomento. |
| `USD` | Dólar estadounidense. |

---

## ⚙️ Notas técnicas
- Campos `createdAt`, `updatedAt`, y `deletedAt` son generados automáticamente por TypeORM.
- La relación con `Document` permite almacenar archivos asociados a cada pago.
- Puede extenderse para registrar integraciones con pasarelas de pago externas (ej. Webpay, Flow, etc.).

---

© 2025 — Sistema Inmobiliario | Entidad **Payment**
