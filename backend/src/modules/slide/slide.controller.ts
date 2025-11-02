import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SlideService } from './slide.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('slide')
export class SlideController {
  constructor(private readonly slideService: SlideService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createSlideDto: CreateSlideDto) {
    return this.slideService.create(createSlideDto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.slideService.findAll(search);
  }

  @Get('active')
  findActive(@Query('search') search?: string) {
    return this.slideService.findActive(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.slideService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateSlideDto: UpdateSlideDto) {
    return this.slideService.update(id, updateSlideDto);
  }

  @Patch(':id/toggle-status')
  @UseGuards(JwtAuthGuard)
  toggleStatus(@Param('id') id: string) {
    return this.slideService.toggleStatus(id);
  }

  @Post('reorder')
  @UseGuards(JwtAuthGuard)
  reorder(@Body('slideIds') slideIds: string[]) {
    return this.slideService.reorder(slideIds);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.slideService.remove(id);
  }
}