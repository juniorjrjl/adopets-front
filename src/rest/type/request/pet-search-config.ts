export class With{
    public _fields: Array<String> = [];
}

export class WithBranch{
    public uuid: String = "";
    public _fields: Array<String> = [];
}

export class Specie{
    public with = new With();
}

export class BreedPrimary{
    public with = new With();
}

export class Branch{
    public with = new WithBranch();
}

export class Search{
    public sex_key: "MALE" | "FEMALE" = "MALE";
    public _fields: Array<String> = [];
    public specie = new Specie();
    public breed_primary = new BreedPrimary();
    public branch = new Branch();
}

export class Option{

    public page: Number = 0;
    public limit: Number = 0;
    public sort: Array<string> = [];

}

export class PetSearchConfig{
    public search = new Search()
    public options = new Option()
}