import { MigrationInterface, QueryRunner } from "typeorm"
import * as fs from 'fs';
import * as csv from 'csv-parser';
import * as path from 'path';



const CSV_PATH = path.join(__dirname, '..', 'assets', 'koreaRegion.csv');
const PROVINCE_COLUMN = 1;

export class PublicProvince1698808839292 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        const provinces = await this.getProvincesFromCSV(); 

        for(const province of provinces) {
            await this.insertProvince(queryRunner, province);
        }

        console.log('Province 마이그레이션 성공');
    }
    

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM province`);
    }

    private async getProvincesFromCSV(): Promise<Set<string>> {
        return new Promise<Set<string>>((resolve, reject) => {
            const provinces = new Set<string>();

            fs.createReadStream(CSV_PATH)
                .pipe(csv({ headers: false}))
                .on('data', (row) => {
                    provinces.add(row[PROVINCE_COLUMN]);
                })
                .on('error', (error) => {
                    console.error("csv를 읽는 도중 에러 발생:", error);
                    reject(error);
                })
                .on('end', () => {
                    resolve(provinces);
                });
        });
    }

    private async insertProvince(queryRunner: QueryRunner, province: string): Promise<void> {
        const insertQuery = `INSERT INTO province (name) VALUES (?)`;
        await queryRunner.query(insertQuery, [province]);
    }

}
