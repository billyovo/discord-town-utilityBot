const {describe, expect, test, toBe} = require('@jest/globals');
const { DateTime } = require("luxon");

const arrival_date = DateTime.now().setZone("Asia/Taipei").set({day: 24, month: 4, year: 2022}).startOf("day");

function returnDiffObj(now){
    if(now.ordinal === arrival_date.ordinal){
        const diff = now.diff(arrival_date,'years').toObject();
        return Math.round(diff.years);
    }
    else{
        const diff = now.diff(arrival_date,'days').toObject();
        return Math.round(diff.days);
    }
    
}
describe('New life module',()=>{
    test('normal date short',()=>{
        const now = DateTime.now().setZone("Asia/Taipei").set({day: 25, month: 4, year: 2022}).startOf("day");
        const diff = returnDiffObj(now);
        expect(diff).toBe(1);
    })
    test('normal date long',()=>{
        const now = DateTime.now().setZone("Asia/Taipei").set({day: 12, month: 12, year: 2022}).startOf("day");
        const diff = returnDiffObj(now);
        expect(diff).toBe(232);
    })
    test('anniversary 1',()=>{
        const now = DateTime.now().setZone("Asia/Taipei").set({day: 24, month: 4, year: 2023}).startOf("day");
        const diff = returnDiffObj(now);
        expect(diff).toBe(1);
    })

    test('anniversary 7',()=>{
        const now = DateTime.now().setZone("Asia/Taipei").set({day: 24, month: 4, year: 2029}).startOf("day");
        const diff = returnDiffObj(now);
        expect(diff).toBe(7);
    })

    test('normal date 2 years',()=>{
        const now = DateTime.now().setZone("Asia/Taipei").set({day: 17, month: 5, year: 2025}).startOf("day");
        const diff = returnDiffObj(now);
        expect(diff).toBe(1119);
    })

    test('normal date 2 years ver 2',()=>{
        const now = DateTime.now().setZone("Asia/Taipei").set({day: 7, month: 2, year: 2035}).startOf("day");
        const diff = returnDiffObj(now);
        expect(diff).toBe(4672);
    })
})