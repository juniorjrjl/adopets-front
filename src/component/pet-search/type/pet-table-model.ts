
export class PetTableModel{
    public id: number = 0;
    public name: string = "";
    public specie: string = "";
    public breed: string = "";
    public created_date: Date = new Date();
    public status_key: string = "";
    public price: Number = 0;
    public payment_model: "FREE" | "ADOPTER_PAYS";
    public sex: "MALE" | "FEMALE"
    public size:     "S" | "M" | "L" | "XL"
    public age: "BABY" |"YOUNG" | "ADULT" | "SENIOR"

    constructor(id: number, name: string, specie: string, breed: string, created_date: Date, status_key: string, 
                price: number, payment_model: "FREE" | "ADOPTER_PAYS", sex: "MALE" | "FEMALE", size:  "S" | "M" | "L" | "XL", 
                age: "BABY" |"YOUNG" | "ADULT" | "SENIOR"){
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