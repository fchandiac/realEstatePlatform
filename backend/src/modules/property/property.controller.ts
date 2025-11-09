import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  Res,
  UseInterceptors,
  UploadedFiles,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { PropertyService } from './property.service';
import { Property } from '../../entities/property.entity';
import { CreatePropertyDto, UpdatePropertyDto, UpdatePropertyCharacteristicsDto } from './dto/property.dto';
import { UpdatePropertyLocationDto } from './dto/update-property-location.dto';
import { UpdatePropertyBasicDto } from './dto/update-property-basic.dto';
import { CreatePropertyDto as CreatePropertyPayloadDto } from './dto/create-property.dto';
import { UpdateMainImageDto } from './dto/create-property.dto';
import { UpdatePropertyPriceDto } from './dto/update-property-price.dto';
import { GridSaleQueryDto } from './dto/grid-sale.dto';
import { GetFullPropertyDto } from './dto/get-full-property.dto';
import { Audit } from '../../common/interceptors/audit.interceptor';
import { AuditAction, AuditEntityType } from '../../common/enums/audit.enums';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadPropertyMultimediaDto } from './dto/upload-property-multimedia.dto';
import { FileUploadService } from '../../common/services/file-upload.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Configuración de storage para uploads de propiedades
const propertyUploadStorage = diskStorage({
  destination: (req, file, callback) => {
    // Todas las imágenes y videos van a ./public/properties
    callback(null, './public/properties');
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = extname(file.originalname);
    callback(null, `${uniqueSuffix}${ext}`);
  },
});

@Controller('properties')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Get('grid-sale/excel')
  @Audit(AuditAction.READ, AuditEntityType.PROPERTY, 'Sale properties Excel exported')
  async exportSaleGridExcel(
    @Query(ValidationPipe) query: GridSaleQueryDto,
    @Res() res: Response,
  ) {
    const buffer = await this.propertyService.exportSalePropertiesExcel(query);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="propiedades-en-venta.xlsx"',
    });
    res.send(buffer);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('multimediaFiles', 10, {
    storage: diskStorage({
      destination: (req, file, callback) => {
        // Todas las imágenes y videos van a ./public/properties
        callback(null, './public/properties');
      },
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        callback(null, `${uniqueSuffix}${ext}`);
      },
    }),
    limits: { 
      fileSize: 70 * 1024 * 1024, // Máximo global 70MB (para videos)
      files: 10 // Máximo 10 archivos
    },
    fileFilter: (req, file, callback) => {
      // Validar tipos de archivo permitidos
      const allowedMimes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'
      ];
      
      if (!allowedMimes.includes(file.mimetype)) {
        callback(new Error(`Tipo de archivo ${file.mimetype} no permitido`), false);
        return;
      }

      // Validar tamaño específico por tipo de archivo
      const isVideo = file.mimetype.startsWith('video/');
      const maxSizeInBytes = isVideo ? 70 * 1024 * 1024 : 10 * 1024 * 1024; // 70MB para videos, 10MB para imágenes
      const maxSizeLabel = isVideo ? '70MB' : '10MB';
      const fileType = isVideo ? 'videos' : 'imágenes';

      if (file.size > maxSizeInBytes) {
        callback(new Error(`Archivo demasiado grande. Máximo permitido: ${maxSizeLabel} para ${fileType}`), false);
        return;
      }

      callback(null, true);
    }
  }))
  @Audit(AuditAction.CREATE, AuditEntityType.PROPERTY, 'Property created')
  async create(
    @Body() body: any,
    @Req() request: any,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    console.log('🏠 [PropertyController] ===== STARTING PROPERTY CREATION =====');
    console.log('📄 [PropertyController] Raw body received:', Object.keys(body));
    console.log('📄 [PropertyController] Raw body content:', body);
    console.log('📄 [PropertyController] Request headers:', {
      'content-type': request.headers['content-type'],
      'content-length': request.headers['content-length']
    });
    console.log('📸 [PropertyController] Files received count:', files?.length || 0);
    console.log('📋 [PropertyController] Files received details:', files?.map(f => ({
      fieldname: f.fieldname,
      originalName: f.originalname,
      filename: f.filename,
      size: f.size,
      mimetype: f.mimetype,
      buffer: f.buffer ? 'HAS_BUFFER' : 'NO_BUFFER',  // ← VERIFICA QUE TENGAN BUFFER
      path: f.path || 'NO_PATH'
    })) || []);

    // Parse the 'data' field from FormData which contains the JSON string
    let createPropertyDto: CreatePropertyPayloadDto;
    try {
      if (body.data) {
        // If data is sent as a field in the form
        createPropertyDto = typeof body.data === 'string'
          ? JSON.parse(body.data)
          : body.data;
      } else {
        // Fallback: assume the body is the DTO directly
        createPropertyDto = body;
      }

      console.log('📊 [PropertyController] Parsed property data:', {
        title: createPropertyDto.title,
        price: createPropertyDto.price,
        currencyPrice: createPropertyDto.currencyPrice,
        operationType: createPropertyDto.operationType,
        status: createPropertyDto.status
      });

      // Validate the DTO (sin agregar archivos que pueden ser filtrados)
      const validatedDto = await new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true }
      }).transform(createPropertyDto, { type: 'body', metatype: CreatePropertyPayloadDto });

      console.log('✅ [PropertyController] DTO validated successfully');

      // Obtener el ID del usuario creador del request
      const creatorId = request.user?.id;

      if (!creatorId) {
        console.error('❌ [PropertyController] No user ID found in request');
        throw new Error('User ID not found in request. Authentication required.');
      }

      console.log('👤 [PropertyController] Creator user ID:', creatorId);
      console.log('🚀 [PropertyController] About to call service with:', {
        filesCount: files?.length || 0,
        filesDetails: files?.map(f => ({
          originalname: f.originalname,
          filename: f.filename,
          size: f.size,
          path: f.path
        })) || []
      });

      // Pasar archivos como parámetro separado en lugar de dentro del DTO
      const result = await this.propertyService.createPropertyWithFiles(validatedDto, creatorId, files || []);

      console.log('🎉 [PropertyController] Property created successfully:', {
        id: result?.id,
        title: result?.title,
        multimediaCount: result?.multimedia?.length || 0
      });

      return result;
    } catch (error) {
      console.error('[PropertyController] Error creating property:', error);

      if (error.message?.includes('validation')) {
        throw new Error(`Validation error: ${error.message}`);
      }

      if (error.message?.includes('multimedia') || error.message?.includes('upload')) {
        throw new Error(`File upload error: ${error.message}`);
      }

      throw new Error(`Failed to create property: ${error.message || error}`);
    }
  }

  @Get()
  @Audit(AuditAction.READ, AuditEntityType.PROPERTY, 'Properties listed')
  findAll(@Query() filters: any) {
    return this.propertyService.findAll(filters);
  }

  @Get('grid-sale')
  @Audit(AuditAction.READ, AuditEntityType.PROPERTY, 'Sale properties grid viewed')
  gridSale(@Query(ValidationPipe) query: GridSaleQueryDto) {
    return this.propertyService.gridSaleProperties(query);
  }

  /**
   * Endpoint público (sin token) para listar propiedades publicadas visibles en el portal.
   */
  @Get('public')
  @Audit(AuditAction.READ, AuditEntityType.PROPERTY, 'Public list of published properties')
  async listPublishedPublic() {
    return await this.propertyService.listPublishedPublic();
  }

  @Get(':id')
  @Audit(AuditAction.READ, AuditEntityType.PROPERTY, 'Property viewed')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }

  /**
   * Devuelve todos los detalles de la propiedad, incluyendo relaciones y datos agregados.
   */
  @Get(':id/full')
  @Audit(AuditAction.READ, AuditEntityType.PROPERTY, 'Full property details viewed')
  async getFullProperty(@Param('id') id: string): Promise<GetFullPropertyDto> {
    return await this.propertyService.getFullProperty(id);
  }

  /**
   * Public endpoint: list published and featured properties
   */
  @Get('public/featured')
  async getPublicFeatured() {
    const data = await this.propertyService.findPublishedFeaturedPublic();
    return { success: true, data };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Audit(AuditAction.UPDATE, AuditEntityType.PROPERTY, 'Property updated')
    // No changes needed; description is handled by DTOs in create and update endpoints.
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updatePropertyDto: UpdatePropertyDto,
    @Req() request: any,
  ) {
    // Extraer el ID del usuario de manera más robusta
    const user = request?.user;
    const userId = user?.id || user?.sub || (typeof user === 'string' ? user : undefined);

    return this.propertyService.update(id, updatePropertyDto, userId);
  }

  /**
   * Actualiza solo la información básica de la propiedad
   */
  @Patch(':id/basic')
  @UseGuards(JwtAuthGuard)
  @Audit(AuditAction.UPDATE, AuditEntityType.PROPERTY, 'Property basic info updated')
  async updateBasic(
    @Param('id') id: string,
    @Body(ValidationPipe) dto: UpdatePropertyBasicDto,
    @Req() request: any,
  ): Promise<Property> {
    // Extraer el ID del usuario de manera más robusta
    const user = request?.user;
    const userId = user?.id || user?.sub || (typeof user === 'string' ? user : undefined);

    // Reutiliza el método general de actualización con el subconjunto permitido
    return await this.propertyService.update(id, dto as UpdatePropertyDto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Audit(AuditAction.DELETE, AuditEntityType.PROPERTY, 'Property deleted')
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = this.extractUserId(req);
    return this.propertyService.remove(id, userId);
  }

    /**
   * Total de propiedades en venta
   */
  @Get('count-sale')
  @Audit(AuditAction.READ, AuditEntityType.PROPERTY, 'Count sale properties')
  async countSaleProperties() {
    return { total: await this.propertyService.countSaleProperties() };
  }

  /**
   * Total de propiedades publicadas
   */
  @Get('count-published')
  @Audit(AuditAction.READ, AuditEntityType.PROPERTY, 'Count published properties')
  async countPublishedProperties() {
    return { total: await this.propertyService.countPublishedProperties() };
  }

  /**
   * Total de propiedades destacadas
   */
  @Get('count-featured')
  @Audit(AuditAction.READ, AuditEntityType.PROPERTY, 'Count featured properties')
  async countFeaturedProperties() {
    return { total: await this.propertyService.countFeaturedProperties() };
  }

  @Patch(':id/main-image')
  @UseGuards(JwtAuthGuard)
  @Audit(AuditAction.UPDATE, AuditEntityType.PROPERTY, 'Main image updated')
  async updateMainImage(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true })) dto: UpdateMainImageDto,
    @Req() req: any,
  ): Promise<Property> {
    const userId = this.extractUserId(req);
    return this.propertyService.updateMainImage(id, dto.mainImageUrl, userId);
  }

    @Post(':id/multimedia')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 20, {
    storage: diskStorage({
      destination: (req, file, callback) => {
        // Todas las imágenes y videos van a ./public/properties
        callback(null, './public/properties');
      },
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
    limits: {
      fileSize: 70 * 1024 * 1024, // Máximo global 70MB (para videos)
      files: 20 // Máximo 20 archivos
    },
    fileFilter: (req, file, callback) => {
      // Validar tipos de archivo permitidos
      const allowedMimes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'
      ];

      if (!allowedMimes.includes(file.mimetype)) {
        callback(new Error('Tipo de archivo no permitido'), false);
        return;
      }

      // Validar tamaño específico por tipo de archivo
      const isVideo = file.mimetype.startsWith('video/');
      const maxSizeInBytes = isVideo ? 70 * 1024 * 1024 : 10 * 1024 * 1024; // 70MB para videos, 10MB para imágenes
      const maxSizeLabel = isVideo ? '70MB' : '10MB';
      const fileType = isVideo ? 'videos' : 'imágenes';

      if (file.size > maxSizeInBytes) {
        callback(new Error(`Archivo demasiado grande. Máximo permitido: ${maxSizeLabel} para ${fileType}`), false);
        return;
      }

      callback(null, true);
    },
  }))
  @Audit(AuditAction.CREATE, AuditEntityType.MULTIMEDIA, 'Multimedia uploaded to property')
  async uploadMultimedia(
    @Param('id') propertyId: string,
    @Body(new ValidationPipe({ transform: true })) dto: UploadPropertyMultimediaDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ) {
    console.log(`� Endpoint llamado: POST /properties/${propertyId}/multimedia`);
    console.log(`� Usuario: ${req.user?.id}`);
    console.log(`� Archivos recibidos: ${files?.length || 0}`);
    
    if (!files || files.length === 0) {
      console.error('❌ No se recibieron archivos');
      throw new BadRequestException('No se recibieron archivos');
    }

    const userId = this.extractUserId(req);
    const uploadedMultimedia = await this.propertyService.uploadMultimedia(propertyId, files, dto, userId);

    return {
      message: 'Multimedia uploaded successfully',
      data: uploadedMultimedia
    };
  }

  /**
   * Actualiza la información de precio y SEO de una propiedad
   */
  @Patch(':id/price')
  @UseGuards(JwtAuthGuard)
  @Audit(AuditAction.UPDATE, AuditEntityType.PROPERTY, 'Property price and SEO updated')
  async updatePrice(
    @Param('id') id: string,
    @Body(ValidationPipe) dto: UpdatePropertyPriceDto,
    @Req() req: any,
  ): Promise<Property> {
    const userId = this.extractUserId(req);
    return this.propertyService.updatePrice(id, dto, userId);
  }

  /**
   * Actualiza las características de una propiedad
   */
  @Patch(':id/characteristics')
  @UseGuards(JwtAuthGuard)
  @Audit(AuditAction.UPDATE, AuditEntityType.PROPERTY, 'Property characteristics updated')
  async updateCharacteristics(
    @Param('id') id: string,
    @Body(ValidationPipe) dto: UpdatePropertyCharacteristicsDto,
    @Req() req: any,
  ): Promise<Property> {
    const userId = this.extractUserId(req);
    return this.propertyService.updateCharacteristics(id, dto, userId);
  }

  /**
   * Actualiza la ubicación de una propiedad
   */
  @Patch(':id/location')
  @UseGuards(JwtAuthGuard)
  @Audit(AuditAction.UPDATE, AuditEntityType.PROPERTY, 'Property location updated')
  async updateLocation(
    @Param('id') id: string,
    @Body(ValidationPipe) dto: UpdatePropertyLocationDto,
    @Req() req: any,
  ): Promise<Property> {
    const userId = this.extractUserId(req);
    return this.propertyService.updateLocation(id, dto, userId);
  }

  /**
   * Verifica si una multimedia específica es la imagen principal de la propiedad
   */
  @Get(':propertyId/multimedia/:multimediaId/is-main')
  @UseGuards(JwtAuthGuard)
  @Audit(AuditAction.READ, AuditEntityType.PROPERTY, 'Multimedia main status checked')
  async isMultimediaMain(
    @Param('propertyId') propertyId: string,
    @Param('multimediaId') multimediaId: string,
  ): Promise<{ isMain: boolean }> {
    const isMain = await this.propertyService.isMultimediaMain(propertyId, multimediaId);
    return { isMain };
  }

  private extractUserId(req: any): string {
    const user = req.user as any;
    if (user?.id) return user.id;
    if (user?.sub) return user.sub;
    if (typeof user === 'string') return user;
    return 'system';
  }
}
