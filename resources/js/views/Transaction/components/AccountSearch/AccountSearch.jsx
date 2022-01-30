import React from 'react';
import PropTypes from 'prop-types';
import { throttle } from "lodash";
import './AccountSearch.scss';
import Chip from '@material-ui/core/Chip';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import Select , { components }  from "react-select";
import CreatableSelect from 'react-select/creatable';
import AsyncCreatableSelect from 'react-select/async-creatable';
import NumberFormat from 'react-number-format';

const baseUrl = window.Laravel.baseUrl

const wait = 0;
const customChip = (color = '#33300') => ({
    border: '1px solid ' + color,
    color: color,
    fontSize: '12px',
})
function formatMoney(amount, decimalCount = 0, decimal = ".", thousands = ",") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
      const negativeSign = amount < 0 ? "-" : "";
  
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
  
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e)
    }
};
const CustomOption = props => {
    const { data, innerRef, innerProps } = props;
    return data.custom ? (        
        <Card className= "search-card" ref={innerRef} {...innerProps}>
            <CardContent>
                <Chip style={customChip()} variant="outlined" color="secondary" label={data.level_2} size="small" />
                <b> | {data.name} | </b> <NumberFormat value={data.balance} displayType={'text'} thousandSeparator={true}/>          
            </CardContent>
        </Card>       
    ) : <components.Option {...props} />
};
const findAccounts = (inputValue) => {
    return axios.post(baseUrl + '/account/find', {key: inputValue})
        .then(response => {
            return response.data.map(account => {
                account.value = account.id
                account.label = account.level_2 +" | "+ account.name + " | "+ formatMoney(account.balance)
                account.custom = 1
                return account
            })
        })
        .catch(err => {
            console.log('find account bug: ' + err.response.data)
        })
}

const throttleOptions = throttle(findAccounts, wait)
const promptTextCreator = (value) => {
    return 'Tạo mới tài khoản' + value
}
const checkValidCreate = (inputValue, selectValue, selectOptions) => {
    if(inputValue == "" || !isNaN(inputValue)){
        return false
    }else return true
}
const AccountSearch = props => {
    const {account, handleAccountChange} = props
    return (
        <AsyncCreatableSelect
            components={{ Option: CustomOption }}
            loadOptions={inputValue => throttleOptions(inputValue)}
            autosize={true}
            isClearable
            placeholder={'Tìm kiếm tài khoản'}
            name="account_name"
            value = {account}
            onChange = {handleAccountChange}
            formatCreateLabel = {promptTextCreator}
            isValidNewOption = {checkValidCreate}
            className="select-box-account"
        />
    )
}
AccountSearch.propTypes = {
  className: PropTypes.string,  
};

export default AccountSearch;
