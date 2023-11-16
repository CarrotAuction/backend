import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @Column({ type: 'longblob', nullable: true })
  buffer: Buffer;

  @Column({ nullable: true })
  mimetype: string;
}
