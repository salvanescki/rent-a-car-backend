import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

/* 
TODO:
 - After creating Role, update the type of role column
 - To get documents, for normalization purposes, select * from Documents where userId == id
*/

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    dob: Date;

    @Column({unique: true})
    email: string;

    @Column()
    address: string;

    @Column()
    country: string;

    @Column()
    role: string; // Type: Rol (enum)

    /* 
    @Column({nullable: true})
    documents: Document
    */

    @Column({type: 'date', default: () => 'CURRENT_DATE'})
    createdAt: Date;

    @Column({type: 'date', default: () => 'CURRENT_DATE'})
    updatedAt: Date;
}