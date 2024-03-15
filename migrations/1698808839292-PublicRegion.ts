import { MigrationInterface, QueryRunner } from "typeorm"
import * as xlsx from 'xlsx';
import * as path from 'path';


const XLSX_PATH = path.join(__dirname, '..', 'assets', 'koreaRegion.xlsx');
const PROVINCE_COLUMN = 0;
const CITY_COLUMN = 1;
const DISTRICT_COLUMN = 2;
const NEIGHBORHOOD_COLUMN = 3;

export class PublicRegion1698808839292 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        const regions = await this.getRegionsFromXLSX(); 

        for(const region of regions) {
            await this.insertRegion(queryRunner, region);
        }

        console.log('Region 마이그레이션 성공');
    }
    

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM region`);
    }


    private async getRegionsFromXLSX(): Promise<any[]> {
        const regionExcel = xlsx.readFile(XLSX_PATH);
        // 첫번쨰 시트로 이동
        const sheetName = regionExcel.SheetNames[0];
        // 시트의 데이터 얻기
        const sheetData = regionExcel.Sheets[sheetName];
        // 데이터 json 객체로 만들기
        const data = xlsx.utils.sheet_to_json(sheetData, {header:1});
        
        const regionData = [];
        const pathMap = new Map();
        let curId = 0;
        
        
        for(let i = 3; i<data.length; i++){
            const val = data[i];
            const province = val[PROVINCE_COLUMN];
            const city = val[CITY_COLUMN];
            const district = val[DISTRICT_COLUMN];
            const neigborhood = val[NEIGHBORHOOD_COLUMN];
        
            // 대분류 뽑기
            if(province && !pathMap.has(province)){
                curId++;
                const regionVal = {
                    id: curId,
                    name: province,
                    mpath: `${curId}`,
                    parentId: null
                };
                regionData.push(regionVal);
                pathMap.set(province, regionVal);
            }
            // 시/군 뽑기
            if(city  && province && !pathMap.has(city)){
                curId++;
                // 대분류 가져오기
                const provinceVal = pathMap.get(province);
                const regionVal = {
                    id: curId,
                    name: city,
                    mpath: `${provinceVal.mpath}/${curId}`,
                    parentId: provinceVal.id
                };
                regionData.push(regionVal);
                pathMap.set(city, regionVal);
            }
            //구 뽑기 => 부모가 대분류 or 시/군이라서 처리해야함
            if(district && !pathMap.has(district)){
                // 부모찾기
                const parentRegion = city? pathMap.get(city) : pathMap.get(province);
                curId++;
                const regionVal = {
                    id: curId,
                    name: district,
                    mpath: `${parentRegion.mpath}/${curId}`,
                    parentId: parentRegion.id
                };
                regionData.push(regionVal);
                pathMap.set(district, regionVal);
            }
            //동.면.리 뽑기 => 부모가 대분류 or 시/군 or 구라서 처리
            // 중복이 없어서 map에 넣을 필요가 없음
            if(neigborhood){
                // 부모 찾기
                const parentRegion = district? pathMap.get(district) : city? pathMap.get(city) : pathMap.get(province);
                curId++;
                const regionVal = {
                    id: curId,
                    name: neigborhood,
                    mpath: `${parentRegion.mpath}/${curId}`,
                    parentId: parentRegion.id
                };
                regionData.push(regionVal);
                pathMap.set(neigborhood, regionVal);
            }
        }
        return regionData;
    }

    private async insertRegion(queryRunner: QueryRunner, region: any): Promise<void> {
        const {id, name, mpath, parentId} = region;
        const insertQuery = `
        INSERT INTO region (id, name, mpath, parentId)
        VALUES(?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name = VALUES(name), mpath = VALUES(mpath), parentId = VALUES(parentId)
        `;
        await queryRunner.query(insertQuery, [id, name, mpath, parentId]);
    }

}


