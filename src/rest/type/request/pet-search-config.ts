export class With{
    public _fields: Array<String>;

    constructor(fields: Array<String>){
        this._fields = fields;
    }
}

export class WithBranch{
    public uuid: String;
    public _fields: Array<String>;

    constructor(uuid: String, fields: Array<String>){
        this.uuid = uuid
        this._fields = fields;
    }
}

export class Specie{
    public with: With;

    constructor(fieldsContainer: With){
        this.with = fieldsContainer;
    }

}

export class BreedPrimary{
    public with: With;

    constructor(fieldsContainer: With){
        this.with = fieldsContainer;
    }
}

export class Branch{
    public with: WithBranch;

    constructor(fieldsContainer: WithBranch){
        this.with = fieldsContainer;
    }
}

export class SearchBuilder{
    private readonly __fields: Array<String>;
    private _sex_key: string | undefined;
    private _size_key: string | undefined;
    private _age_key: string | undefined;
    private _specie: Specie = new Specie(new With([]));
    private _breed_primary: BreedPrimary = new BreedPrimary(new With([]));
    private _branch: Branch = new Branch(new WithBranch("", []));

    constructor(_fields: Array<String>){
        this.__fields = _fields;
    }

    public get _fields(): Array<String>{
        return this.__fields;
    }

    public get sex_key(): string | undefined{
        return this._sex_key
    }

    public get size_key(): string | undefined{
        return this._size_key
    }

    public get age_key(): string | undefined{
        return this._age_key
    }

    public get specie(): Specie{
        return this._specie;
    }

    public get breed_primary(): BreedPrimary{
        return this._breed_primary;
    }

    public get branch(): Branch{
        return this._branch;
    }

    public setSex_key(sex_key: string | undefined): SearchBuilder{
        this._sex_key = sex_key;
        return this;
    }

    public setSize_key(size_key: string | undefined): SearchBuilder{
        this._size_key = size_key;
        return this;
    }

    public setAge_key(age_key: string | undefined): SearchBuilder{
        this._age_key = age_key;
        return this;
    }

    public setSpecieFields(fields: Array<String>): SearchBuilder{
        this._specie = new Specie(new With(fields));
        return this;
    }

    public setBreedPrimary(fields: Array<String>): SearchBuilder{
        this._breed_primary = new BreedPrimary(new With(fields));
        return this;
    }

    public setBranch(uuid: String, fields: Array<String>): SearchBuilder{
        this._branch = new Branch(new WithBranch(uuid, fields));
        return this;
    }

    public build(): Search{
        return new Search(this);
    }

}

export class Search{
    public sex_key: string | undefined
    public size_key: string | undefined
    public age_key: string | undefined
    public _fields: Array<String> = [];
    public specie = new Specie(new With([]));
    public breed_primary = new BreedPrimary(new With([]));
    public branch = new Branch(new WithBranch("", []));

    constructor(searchBuilder: SearchBuilder){
        this.sex_key = searchBuilder.sex_key;
        this.size_key = searchBuilder.size_key;
        this.age_key = searchBuilder.age_key;
        this._fields = searchBuilder._fields;
        this.specie = searchBuilder.specie;
        this.breed_primary = searchBuilder.breed_primary;
        this.branch = searchBuilder.branch;
    }
}

export class Option{

    public page: Number = 0;
    public limit: Number = 0;
    public sort: Array<string> = [];

}

export class PetSearchConfig{
    public search = new Search(new SearchBuilder([]))
    public options = new Option()
}
