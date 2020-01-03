import React, {Component} from 'react';
import { Tag, Table, Row, Col, Button, Tooltip, Layout } from 'antd';
import { PetTableModel } from './type/pet-table-model';
import moment from 'moment';
import { ColumnProps, SortOrder, PaginationConfig, TableCurrentDataSource, SorterResult } from 'antd/lib/table';
import 'antd/dist/antd.min.css'
import './pet-search.css'
import { SessionKey } from '../../constants/session-key';
import ManagementPet from '../../rest/type/management-pet';
import { PetSearchConfig, Option, Search } from '../../rest/type/request/pet-search-config';
const  { Header, Content} = Layout;

export interface IProps { }

export interface IState {
    currentUser: string
    data: Array<PetTableModel>
    loading: boolean
}

export class PetSearch extends Component<IProps, IState>{

  constructor(props: IProps){
    super(props);
    this.state = {
      currentUser: "",
      data: [],
      loading: false
    }
  }

    componentDidMount(){
      let user = sessionStorage.getItem(SessionKey.CURRENT_USER);
      if (user) {
        this.setState({currentUser:  user})
        this.findPets();
      }
    }

    private paginationConfig(): Option{
      let options = new Option();
      options.page = 1;
      options.limit = 10;
      options.sort = ["name"];
      return options
    }

    private filterConfig(): Search{
      let search = new Search();
      search._fields = ["id", "uuid", "custom_code", "name", 
                        "specie_id", "breed_primary_id", "price", "created_date", 
                        "status_key", "branch_id", "payment_model_key", "sex_key",
                        "size_key","age_key"]
      search.specie.with._fields = [ "id","name"]
      search.breed_primary.with._fields = [ "id","name"]
      search.branch.with._fields = [ "id","name"]
      search.branch.with.uuid = "ef71cadf-fa9b-4c8b-a1a8-0e31e784c3ff";
      return search;
    }

    private async findPets(){
      let searchConfig = new PetSearchConfig();
      searchConfig.options = this.paginationConfig();
      searchConfig.search = this.filterConfig();

      this.setState({loading: true});
      await ManagementPet.findPageable(searchConfig)      
        .then(r => {
          this.populateTable(r.data.data.result)
          console.log(r)
        })
        .catch(e => console.error(e));
        this.setState({loading: false});
    }

    private handleTableChange(pagination: PaginationConfig, filters: Partial<Record<keyof PetTableModel, string[]>>, 
            sorter: SorterResult<PetTableModel>, extra: TableCurrentDataSource<PetTableModel>){
      console.log(pagination);
      console.log(filters);
      console.log(sorter);
      console.log(extra)
    }

    private populateTable(jsonResult: Array<any>){
      let pets: Array<PetTableModel> = [];
      jsonResult.forEach((p: any) => {
        let pet = new PetTableModel(p.id, p.name, p.specie.name, p.breed, p.created_date, 
                                    p.status_key, p.price, p.payment_model_key, 
                                    p.sex_key, p.size_key, p.age_key);
        pets.push(pet);
      });
      this.setState({data: pets})
    }

    private sortOptions: SortOrder[] = ["descend", "ascend"]

    private columns: ColumnProps<PetTableModel>[] =[
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            sortDirections: ["descend", "ascend"]
          },
          {
            title: 'Specie',
            dataIndex: 'specie',
            key: 'specie',
            sorter: true,
            sortDirections: ["descend", "ascend"]
          },
          {
            title: 'Breed',
            dataIndex: 'breed',
            key: 'breed',
            sorter: true,
            sortDirections: ["descend", "ascend"]
          },
          {
            title: 'Created date',
            dataIndex: 'created_date',
            key: 'created_date',
            render: (data:Date) => moment(data).format("DD/MM/YYYY hh:mm:ss"),
            sorter: true,
            sortDirections: ["descend", "ascend"]
          },
          {
            title: 'Status',
            dataIndex: 'status_key',
            key: 'status_key',
            sorter: true,
            sortDirections: ["descend", "ascend"]
          },
          {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            sorter: true,
            sortDirections: ["descend", "ascend"]
          },
          {
            title: 'Payment Model',
            dataIndex: 'payment_model',
            key: 'payment_model',
            sorter: true,
            sortDirections: ["descend", "ascend"]
          },

          {
            title: 'Sex',
            dataIndex: 'sex',
            key: 'sex',
            sorter: true,
            sortDirections: ["descend", "ascend"]
          },
          {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            sorter: true,
            sortDirections: ["descend", "ascend"]
          },
          {
            title: 'age',
            dataIndex: 'age',
            key: 'age',
            sorter: true,
            sortDirections: ["descend", "ascend"]
          }
    ]

    render(){
        return <div>
          <Header id="login-header">
            <Row>
              <Col span={4} offset={20}>
                <Tag id="username">{`Welcome ${this.state.currentUser}`}</Tag>
                <Tooltip placement="bottom" title="logout">
                  <Button shape="circle" icon="logout" />
                </Tooltip>
              </Col>
            </Row>
          </Header>
          <Content id="content">
            <Row>
              <Col span={8} offset={8}>
                <h1>Your new friend is waiting for you</h1>
              </Col>
            </Row>
            <Row type="flex">
              <Col span={20} offset={1}>
                <Table locale={{emptyText: "No friends available"}} 
                      pagination={ {pageSizeOptions: ['10', '20'], 
                      showSizeChanger: true}} 
                      columns={this.columns} 
                      dataSource={this.state.data} 
                      rowKey="id" 
                      loading={this.state.loading}
                      onChange={this.handleTableChange}/>
              </Col>
            </Row>
          </Content>
        </div>
    }

}