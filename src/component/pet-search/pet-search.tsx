import React, {Component, ReactElement} from 'react';
import { Tag, Table, Row, Col, Button, Tooltip, Layout } from 'antd';
import { PetTableModel } from './type/pet-table-model';
import moment from 'moment';
import { ColumnProps, PaginationConfig, TableCurrentDataSource, SorterResult } from 'antd/lib/table';
import 'antd/dist/antd.min.css'
import './pet-search.css'
import { SessionKey } from '../../constants/session-key';
import PetManagement from '../../rest/type/pet-management';
import { PetSearchConfig, Option, Search } from '../../rest/type/request/pet-search-config';
import Notification from '../notify/notification';
import history from '../../navigation/history';
import PageKey from '../../constants/page-key';
const  { Header, Content} = Layout;

export interface IProps { }

export interface IState {
    currentUser: string
    data: Array<PetTableModel>
    loading: boolean
    pageConfig: PaginationConfig
}

export class PetSearch extends Component<IProps, IState>{

  constructor(props: IProps){
    super(props);
    this.state = {
      currentUser: "",
      data: [],
      loading: false,
      pageConfig:{
        total: 0,
        defaultCurrent: 1,
        current: 1,
        defaultPageSize: 10,
        pageSize: 10,
        pageSizeOptions: ['10', '20'],
        showTotal: (total: number, range: [number, number]) => `${range[0]} - ${range[1]} of ${total} pets`,
        position: "both"
      }
    }
  }

    componentDidMount(){
      let user = sessionStorage.getItem(SessionKey.CURRENT_USER);
      if (!sessionStorage.getItem(SessionKey.ACCESS_TOKEN)){
        history.push(PageKey.HOME_PAGE);
        Notification.sendNotification("error", "Error", "you must authenticate yourself for access this resource.");
      }
      if (user) {
        this.setState({currentUser:  user});
        let searchConfig = new PetSearchConfig();
        let option = new Option()
        option.limit = 10
        option.page = 1;
        searchConfig.options = option;
        searchConfig.search = this.filterConfig();
        this.findPets(searchConfig);
      }
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

    handleTableChange = (pagination: PaginationConfig, filters: Partial<Record<keyof PetTableModel, string[]>>, 
            sorter: SorterResult<PetTableModel>, extra: TableCurrentDataSource<PetTableModel>) => {        
      let searchConfig = new PetSearchConfig();
      searchConfig.search = this.filterConfig();
      let option = new Option();
      if (pagination){
        option.page = pagination.current ? pagination.current : 1;
        option.limit = pagination.pageSize ? pagination.pageSize : 10;
      }
      if (sorter.order){
        option.sort.push(sorter.order === "descend" ? `-${sorter.columnKey}`: sorter.columnKey)
      }
      if (filters){
        searchConfig.search.sex_key = filters && filters["sex"] ? filters["sex"].toString() : undefined
        searchConfig.search.size_key = filters && filters["size"] ? filters["size"].toString() : undefined
        searchConfig.search.age_key = filters && filters["age"] ? filters["age"].toString() : undefined
      }
      searchConfig.options = option;
      this.findPets(searchConfig)
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

    private async findPets(searchConfig: PetSearchConfig) {
      this.setState({loading: true});
      await PetManagement.findPageable(searchConfig)      
        .then(r => {
          if (r.data.data){
            this.populateTable(r.data.data.result)
            this.setState({
                pageConfig:{
                  total: r.data.data.count,
                  current: r.data.data.page,
                  pageSize: r.data.data.limit,
                }
            })
          }else{
            Notification.sendNotification("error", "Error", r.data.message);
          }
        })
        .catch(e => {
          Notification.sendNotification("error", "Error", "Unexpected error, please contact a system administrator");
        });
        this.setState({loading: false});
    }

    private logout(){
      sessionStorage.clear();
      history.push(PageKey.HOME_PAGE);
    }

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
            sortDirections: ["descend", "ascend"],
            filters: [{text: "Male", value: "MALE"}, {text: "Female", value: "FEMALE"}],
            filterMultiple: false,
            render: (data: string) => data.charAt(0) + data.slice(1).toLocaleLowerCase()
          },
          {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            sorter: true,
            filters: [{text: "S", value : "S"}, {text: "M", value: "M"}, {text: "L", value: "L"}, {text: "XL", value: "XL"}],
            filterMultiple: false,
            sortDirections: ["descend", "ascend"]
          },
          {
            title: 'age',
            dataIndex: 'age',
            key: 'age',
            sorter: true,
            sortDirections: ["descend", "ascend"],
            filters: [{text: "Baby", value : "BABY"}, {text: "Young", value: "YOUNG"}, 
                      {text: "Adult", value: "ADULT"}, {text: "Senior", value: "SENIOR"}],
            filterMultiple: false,
            render: (data: string) => data.charAt(0) + data.slice(1).toLocaleLowerCase()
          },
    ]

    render(){
        return <div>
          <Header id="login-header">
            <Row>
              <Col span={4} offset={20}>
                <Tag id="username">{`Welcome ${this.state.currentUser}`}</Tag>
                <Tooltip placement="bottom" title="logout">
                  <Button shape="circle" icon="logout" onClick={this.logout}/>
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
                      pagination={this.state.pageConfig} 
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