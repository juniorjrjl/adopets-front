
export class PetTableModel{
    public id: number = 0;
    public name: string = "";
    public specie: string = "";
    public breed: string = "";
    public created_date: Date = new Date();
    public status: string = "";
    public price: Number = 0;
    public payment_model: "FREE" | "ADOPTER_PAYS";
    public sex_key: "MALE" | "FEMALE"
    public size_key: "S" | "M" | "L" | "XL"
    public age_key: "BABY" |"YOUNG" | "ADULT" | "SENIOR"

    constructor(id: number, name: string, specie: string, breed: string, created_date: Date, status: string, 
                price: number, payment_model: "FREE" | "ADOPTER_PAYS", sex_key: "MALE" | "FEMALE", size_key:  "S" | "M" | "L" | "XL", 
                age_key: "BABY" |"YOUNG" | "ADULT" | "SENIOR"){
        this.id = id;
        this.name = name;
        this.specie = specie;
        this.breed = breed;
        this.created_date = created_date;
        this.status = status;
        this.price = price;
        this.payment_model = payment_model;
        this.sex_key = sex_key;
        this.size_key = size_key;
        this.age_key= age_key;
    }

}