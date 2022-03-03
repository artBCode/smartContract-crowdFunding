import React from 'react';
import { Menu } from 'semantic-ui-react';

export default () => {
    return (
       <Menu style={{ marginTop: '10px'}}>
           <Menu.Item>
                CrowdFunding
           </Menu.Item>

           <Menu.Menu position='right' >
               <Menu.Item>
                   Campaigns
               </Menu.Item>
               <Menu.Item>
                   <b>+</b>
               </Menu.Item>
           </Menu.Menu>
       </Menu> 
    );
}