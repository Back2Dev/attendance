import React from 'react';
import {Menu} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Search from './search';

const SubMenu = (props) => {
    return (
        <Menu stackable>
          <Menu.Item as={Link} to="/addvolunteer" name='Add New Volunter' />
          <Menu.Item position='right'>
            <Search 
              onSearchInput={props.onSearchInput} 
              searchQuery={props.searchQuery}
            />
          </Menu.Item>
        </Menu>
    )
}

export default SubMenu
