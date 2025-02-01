import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {
    Form, Field, CellGroup, Cell, Button, Image as VanImage,
    Tabbar, TabbarItem, Notify, Toast, FloatingPanel, List, Search, ActionSheet,
    Dialog, Grid, GridItem, Divider, Icon, Tag, NavBar, Stepper, Popover, Loading
} from 'vant';
import { createPinia } from 'pinia'
import 'vant/lib/index.css';
import './style.css';

const pinia = createPinia()

const app = createApp(App)

app.use(pinia);
app.use(Form);
app.use(Field);
app.use(CellGroup);
app.use(Button);
app.use(VanImage);
app.use(Tabbar);
app.use(TabbarItem);
app.use(router);
app.use(Cell);
app.use(Notify);
app.use(Toast);
app.use(FloatingPanel);
app.use(List);
app.use(Search);
app.use(ActionSheet);
app.use(Dialog);
app.use(Grid);
app.use(GridItem);
app.use(Divider);
app.use(Icon);
app.use(Tag);
app.use(NavBar);
app.use(Stepper);
app.use(Popover);
app.use(Loading);

app.mount('#app')
