import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Identity } from '../../entities/identity.entity';
import { CreateIdentityDto, UpdateIdentityDto } from './dto/identity.dto';
import { MultimediaService } from '../multimedia/services/multimedia.service';
import { StaticFilesService } from '../multimedia/services/static-files.service';

@Injectable()
export class IdentitiesService {
  constructor(
    @InjectRepository(Identity)
    private readonly identityRepository: Repository<Identity>,
    private readonly multimediaService: MultimediaService,
    private readonly staticFilesService: StaticFilesService,
  ) {}

  async create(
    createIdentityDto: CreateIdentityDto,
    files?: {
      logo?: Express.Multer.File[];
      partnershipLogos?: Express.Multer.File[];
    },
  ): Promise<Identity> {
    // Handle logo upload
    if (files?.logo?.[0]) {
      const logoFile = files.logo[0];
      const logoPath = await this.multimediaService.uploadFileToPath(logoFile, 'web/logos');
      createIdentityDto.urlLogo = this.staticFilesService.getPublicUrl(logoPath);
    }

    // Handle partnership logos
    if (files?.partnershipLogos && createIdentityDto.partnerships) {
      for (let i = 0; i < createIdentityDto.partnerships.length; i++) {
        const partnership = createIdentityDto.partnerships[i];
        const logoFile = files.partnershipLogos[i];
        if (logoFile) {
          const partnershipPath = await this.multimediaService.uploadFileToPath(logoFile, 'web/partnerships');
          partnership.logoUrl = this.staticFilesService.getPublicUrl(partnershipPath);
        }
      }
    }

    const identity = this.identityRepository.create(createIdentityDto);
    return await this.identityRepository.save(identity);
  }

  async findAll(): Promise<Identity[]> {
    return await this.identityRepository.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Identity> {
    const identity = await this.identityRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!identity) {
      throw new NotFoundException('Identidad corporativa no encontrada.');
    }

    return identity;
  }

  async update(
    id: string,
    updateIdentityDto: UpdateIdentityDto,
    files?: {
      logo?: Express.Multer.File[];
      partnershipLogos?: Express.Multer.File[];
    },
  ): Promise<Identity> {
    const identity = await this.findOne(id);

    // Handle logo upload
    if (files?.logo?.[0]) {
      const logoFile = files.logo[0];
      const logoPath = await this.multimediaService.uploadFileToPath(logoFile, 'web/logos');
      updateIdentityDto.urlLogo = this.staticFilesService.getPublicUrl(logoPath);
    }

    // Handle partnership logos - this is more complex as we need to match with existing partnerships
    if (files?.partnershipLogos && updateIdentityDto.partnerships) {
      for (let i = 0; i < updateIdentityDto.partnerships.length; i++) {
        const partnership = updateIdentityDto.partnerships[i];
        const logoFile = files.partnershipLogos[i];
        if (logoFile) {
          const partnershipPath = await this.multimediaService.uploadFileToPath(logoFile, 'web/partnerships');
          partnership.logoUrl = this.staticFilesService.getPublicUrl(partnershipPath);
        }
      }
    }

    Object.assign(identity, updateIdentityDto);
    return await this.identityRepository.save(identity);
  }

  async findLast(): Promise<Identity | null> {
    return await this.identityRepository.findOne({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async softDelete(id: string): Promise<void> {
    const identity = await this.findOne(id);
    await this.identityRepository.softDelete(id);
  }
}
