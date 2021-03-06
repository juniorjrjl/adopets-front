import 'antd/dist/antd.min.css';
import './pet-search.css';
import React, { Component } from 'react';
import { Tag, Table, Row, Col, Button, Tooltip, Layout } from 'antd';
import { PetTableModel } from './type/pet-table-model';
import moment from 'moment';
import { ColumnProps, PaginationConfig, TableCurrentDataSource, SorterResult } from 'antd/lib/table';
import { SessionKey } from '../../constants/session-key';
import PetManagement from '../../rest/pet-management';
import { PetSearchConfig, Option, Search, SearchBuilder } from '../../rest/type/request/pet-search-config';
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
      this.setState({currentUser:  localStorage.getItem(SessionKey.CURRENT_USER) || ""});
      let searchConfig = new PetSearchConfig();
      let option = new Option()
      option.limit = 10
      option.page = 1;
      searchConfig.options = option;
      searchConfig.search = this.filterConfig();
      this.findPets(searchConfig);
    }

    private filterConfig(): Search{
      return new SearchBuilder(["id", "uuid", "custom_code", "name", 
                                "specie_id", "breed_primary_id", "price", "created_date", 
                                "status_key", "branch_id", "payment_model_key", "sex_key",
                                "size_key","age_key"])
                              .setSpecieFields([ "id","name"])
                              .setBreedPrimary([ "id","name"])
                              .setBranch("ef71cadf-fa9b-4c8b-a1a8-0e31e784c3ff", [ "id","name"])
                              .build();
    }

    handleTableChange = (pagination: PaginationConfig, filters: Partial<Record<keyof PetTableModel, string[]>>, 
            sorter: SorterResult<PetTableModel>, _extra: TableCurrentDataSource<PetTableModel>) => {        
      let searchConfig = new PetSearchConfig();
      searchConfig.search = this.filterConfig();
      let option = new Option();
      if (pagination){
        option.page = pagination.current ? pagination.current : 1;
        option.limit = pagination.pageSize ? pagination.pageSize : 10;
      }
      if (sorter.order){
        option.sort.push(sorter.order === "descend" ? `-${sorter.columnKey}`: `${sorter.columnKey}`)
      }
      if (filters){
        searchConfig.search.sex_key = filters && filters["sex_key"] ? filters["sex_key"].toString() : undefined
        searchConfig.search.size_key = filters && filters["size_key"] ? filters["size_key"].toString() : undefined
        searchConfig.search.age_key = filters && filters["age_key"] ? filters["age_key"].toString() : undefined
      }
      searchConfig.options = option;
      this.findPets(searchConfig)
    }

    private populateTable(jsonResult: Array<any>){
      let pets: Array<PetTableModel> = [];
      jsonResult.forEach((p: any) => {
        let pet = new PetTableModel(p.id, p.name, p.specie.name, p.breed_primary.name, p.created_date, 
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
            if (r.data.code === 5203){
              Notification.sendNotification("error", "Error", "Your session has expired, please login again");
              this.logout();
            }else{
              Notification.sendNotification("error", "Error", r.data.message);
            }
          }
        })
        .catch(_e => Notification.sendNotification("error", "Error", "Unexpected error, please contact a system administrator"));
        this.setState({loading: false});
    }

    private logout(){
      localStorage.clear();
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
            sorter: false,
            sortDirections: ["descend", "ascend"]
          },
          {
            title: 'Breed',
            dataIndex: 'breed',
            key: 'breed',
            sorter: false,
            sortDirections: ["descend", "ascend"]
          },
          {
            title: 'Created date',
            dataIndex: 'created_date',
            key: 'created_date',
            render: (data:Date) => moment(data).format("MM/DD/YYYY hh:mm:ss A"),
            sorter: true,
            sortDirections: ["descend", "ascend"]
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status_key',
            sorter: true,
            sortDirections: ["descend", "ascend"],
            render: (data: string) => data.charAt(0) + data.slice(1).toLocaleLowerCase()
          },
          {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            sorter: true,
            sortDirections: ["descend", "ascend"],
            render: (data: number) =>{
              const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2
              });
              return formatter.format(data)
            }
          },
          {
            title: 'Payment Model',
            dataIndex: 'payment_model',
            key: 'payment_model_key',
            sorter: true,
            sortDirections: ["descend", "ascend"],
            render: (data: string) => {
              let payment = data.charAt(0) + data.slice(1).toLowerCase()
              let underIndex = payment.indexOf("_");
              if (underIndex >= 0){
                let beforeUnder = payment.substring(0, underIndex);
                let afterUnder = payment.substring(underIndex + 1, payment.length);
                payment = beforeUnder + " " + afterUnder.charAt(0).toUpperCase() + afterUnder.slice(1);
              }
              return payment;
            }
          },

          {
            title: 'Sex',
            dataIndex: 'sex_key',
            key: 'sex_key',
            sorter: true,
            sortDirections: ["descend", "ascend"],
            filters: [{text: "Male", value: "MALE"}, {text: "Female", value: "FEMALE"}],
            filterMultiple: false,
            render: (data: string) => data.charAt(0) + data.slice(1).toLocaleLowerCase()
          },
          {
            title: 'Size',
            dataIndex: 'size_key',
            key: 'size_key',
            sorter: true,
            filters: [{text: "S", value : "S"}, {text: "M", value: "M"}, {text: "L", value: "L"}, {text: "XL", value: "XL"}],
            filterMultiple: false,
            sortDirections: ["descend", "ascend"]
          },
          {
            title: 'Age',
            dataIndex: 'age_key',
            key: 'age_key',
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
          <Content id="pet-search-content">
            <Row type="flex">
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