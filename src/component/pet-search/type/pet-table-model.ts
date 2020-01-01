import { PaymentType } from "./enum/payment-type";
import { Sex } from "./enum/sex";
import { Size } from "./enum/size";
import { Age } from "./enum/age";

export class PetTableModel{
    public id: number = 0;
    public name: string = "";
    public specie: string = "";
    public breed: string = "";
    public created_date: Date = new Date();
    public status_key: string = "";
    public price: Number = 0;
    public payment_model:PaymentType = PaymentType.FREE;
    public sex: Sex = Sex.MALE;
    public size: Size = Size.S;
    public age: Age = Age.BABY

    constructor(id: number, name: string, specie: string, breed: string, created_date: Date, status_key: string, 
                price: number, payment_model: PaymentType, sex: Sex, size: Size, age: Age){
        this.id = id;
        this.name = name;
        this.specie = specie;
        this.breed = breed;
        this.created_date = created_date;
        this.status_key = status_key;
        this.price = price;
        this.payment_model = payment_model;
        this.sex = sex;
        this.size = size;
        this.age = age;
    }

}