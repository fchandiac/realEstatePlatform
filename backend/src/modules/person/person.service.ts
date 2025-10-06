import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from '../../entities/person.entity';
import { CreatePersonDto, UpdatePersonDto } from './dto/person.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
  ) {}

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    if (createPersonDto.dni) {
      const existingPerson = await this.personRepository.findOne({
        where: { dni: createPersonDto.dni },
      });
      if (existingPerson) {
        throw new ConflictException('Ya existe una persona con ese DNI');
      }
    }

    const person = this.personRepository.create(createPersonDto);
    return await this.personRepository.save(person);
  }

  async findAll(): Promise<Person[]> {
    return await this.personRepository.find();
  }

  async findOne(id: string): Promise<Person> {
    const person = await this.personRepository.findOne({
      where: { id },
      relations: ['user', 'dniCardFront', 'dniCardRear'],
    });

    if (!person) {
      throw new NotFoundException('Persona no encontrada');
    }

    return person;
  }

  async update(id: string, updatePersonDto: UpdatePersonDto): Promise<Person> {
    const person = await this.findOne(id);

    // Si se está actualizando el DNI, verificar que no exista
      if (updatePersonDto.dni && updatePersonDto.dni !== person.dni) {
      const existingPerson = await this.personRepository.findOne({
        where: { dni: updatePersonDto.dni },
      });
      if (existingPerson) {
        throw new ConflictException('Ya existe una persona con ese DNI');
      }
    }    Object.assign(person, updatePersonDto);
    return await this.personRepository.save(person);
  }

  async remove(id: string): Promise<void> {
    const person = await this.findOne(id);
    await this.personRepository.softRemove(person);
  }
}