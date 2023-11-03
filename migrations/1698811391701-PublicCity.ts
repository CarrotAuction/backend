import { MigrationInterface, QueryRunner } from "typeorm"
import * as fs from 'fs';
import * as csv from 'csv-parser';
import * as path from 'path';
import { error } from "console";


const CSV_PATH = path.join(__dirname, '..', 'assets', 'koreaRegion.csv');
const PROVINCE_COLUMN = 1;
const CITY_COLUMN =  2;

export class PublicCity1698811391701 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const provinces_cities = await this.getProvincesAndCitiesFromCSV();

        for(const province_city of provinces_cities) {
            await this.insertCityAndProvinceId(queryRunner, province_city);
        }

        console.log('City 마이그레이션 성공');

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM city`);
    }

    private async getProvincesAndCitiesFromCSV(): Promise<Set<string>> {
        return new Promise<Set<string>>((resolve, reject) => {
            const provinces_cities = new Set<string>();

            fs.createReadStream(CSV_PATH)
                .pipe(csv({ headers: false}))
                .on('data', (row) => {
                    provinces_cities.add(`${row[PROVINCE_COLUMN]}-${row[CITY_COLUMN]}`);
                })
                .on('error', (error) => {
                    console.error("csv를 읽는 도중 에러 발생:", error);
                    reject(error);
                })
                .on('end', () => {
                    resolve(provinces_cities);
                });
        });
    }

    private async insertCityAndProvinceId(queryRunner: QueryRunner, province_city: string) {
        const provinceStore: {[key: string]: number} = {};
        const [provinceName, cityName] = province_city.split('-');

        if(!provinceStore[provinceName]) {
            const result = await queryRunner.query(`SELECT id FROM province WHERE name = ?`, [provinceName]);
            provinceStore[provinceName] = result[0]?.id;
        }

        const provinceId = provinceStore[provinceName];

        const insertCityQuery = `INSERT INTO city(name, province_id) VALUES(?,?)`;
        await queryRunner.query(insertCityQuery, [cityName, provinceId]);
    }

}
