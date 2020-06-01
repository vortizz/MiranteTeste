<template>
  
    <div class="p-5">

        <regCust />

        <alert :id="home.alert.id" :title="home.alert.title" :msg="home.alert.msg" :funcOnClick="home.alert.funcOnClick" />

        <editCust :id="edit.id" :customer="edit.customer" />

        <b-row class="mt-2 mb-4">
            <b-col cols="12">
                <input type="search" class="form-control form-control-lg" @input="home.filter = $event.target.value" 
                    placeholder="Razão social">
            </b-col>
        </b-row>

        <b-row class="mb-4">
            <b-col cols="11">
                <b-button variant="success" @click="showRegCustomer()">
                    Adicionar cliente
                </b-button>
            </b-col>
            <b-col cols="1">
                <b-button variant="danger" class="float-right" @click="logout()">
                    Sair
                </b-button>
            </b-col>
        </b-row>

        <table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">CPF</th>
                    <th scope="col">Celular</th>
                    <th scope="col">Email</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="c of customerWithFilter">
                    <td>{{ c.name }}</td>
                    <td>{{ c.ssn }}</td>
                    <td>{{ c.cell }}</td>
                    <td>{{ c.email }}</td>
                    <td>
                        <b-button variant="primary" @click="showEditCustomer(c.id)">
                            Editar
                        </b-button>
                    </td>
                    <td>
                        <b-button variant="danger" @click="showRemoveCustomer(c.id, c.name)">
                            Excluir
                        </b-button>
                    </td>
                </tr>
            </tbody>
        </table>

    </div>

</template>

<script>
import RegisterCustomer from "../registerCustomer/RegisterCustomer.vue";
import EditCustomer from "../editCustomer/EditCustomer.vue";
import CustomerService from "../../domain/customer/CustomerService";
import Customer from "../../domain/customer/Customer";
import Alert from "../shared/Alert.vue";

export default {

    components: {
        'regCust': RegisterCustomer,
        'editCust': EditCustomer,
        'alert': Alert
    },

    data() {
        return {
            authToken: '',
            home: {
                customers: [],
                filter: '',
                editId: '',
                alert: {
                    id: "mAlertHome",
                    title: '',
                    msg: '',
                    funcOnClick: () => {}
                }
            },
            edit: {
                id: '',
                customer: new Customer(),
                btnOnSubmit: () => {}
            }
            
        }
    },

    computed: {

        customerWithFilter() {
            
            if(this.home.filter) {
                let exp = new RegExp(this.home.filter.trim(), 'i');
                return this.home.customers.filter(c => exp.test(c.name));
            } else {
                return this.home.customers;
            }
        }

    },

    created() {
        this.authToken = localStorage.getItem('token');
        if (this.authToken == undefined || this.authToken == '') {
            this.$router.push({ name: 'login' });
            return;
        }
        
        this.service = new CustomerService(this.$resource);

        this.service.getAll(this.authToken)
            .then(customers => {
                customers.body.data.forEach(c => this.home.customers.push(c));
            })
            .catch(err => {
                let { status } = err.body;
                if (status == 401) {
                    this.setInfoAlertAndCall('Vish...', 'Sessão expirada', () => {
                        this.$router.push({ name: 'login' });
                    });
                    return;
                }
                if (status == 500) {
                    this.setInfoAlertAndCall('Erro', 'Erro ao acessar os dados dos clientes');
                }
            });

    },

    methods: {

        showRegCustomer() {
            this.$bvModal.show('regCustomer');
        },

        showEditCustomer(id) {
            this.service.getById(id, this.authToken)
                .then(customer => {
                    let { name, ssn, cell, email } = customer.body.data[0];
                    this.edit.id = id;
                    this.edit.customer.authToken = this.authToken;
                    this.edit.customer.name = name;
                    this.edit.customer.ssn = ssn;
                    this.edit.customer.cell = cell;
                    this.edit.customer.email = email;
                    this.$bvModal.show('mEditCustomer');
                })
                .catch(err => {
                    let { status } = err.body;
                    if (status == 401) {
                        this.setInfoAlertAndCall('Vish...', 'Sessão expirada', () => {
                            this.$router.push({ name: 'login' });
                        });
                        return;
                    }
                    if (status == 500) {
                        this.setInfoAlertAndCall('Erro', 'Erro ao acessar os dados do cliente');
                    }
                });
        },

        showRemoveCustomer(id, name) {
            this.$bvModal.msgBoxConfirm(`Realmente deseja remover o cliente ${name}?`, {
                title: "Por favor, confirme",
                okVariant: 'danger',
                okTitle: 'Sim',
                cancelTitle: 'Não',
                centered: true
            })
            .then(value => {
                if (value) {
                    this.service.remove(id, this.authToken)
                    .then(() => {
                        this.setInfoAlertAndCall('Sucesso', 'Cliente removido com sucesso', () => {
                            this.$router.go(0);
                        });
                    })
                    .catch(err => {
                        let { status } = err.body;
                        if (status == 401) {
                            this.setInfoAlertAndCall('Vish...', 'Sessão expirada', () => {
                                this.$router.push({ name: 'login' });
                            });
                            return;
                        }
                        this.setInfoAlertAndCall('Erro', 'Erro ao remover o cliente');
                    })
                }
            });
        },

        setInfoAlertAndCall(title, msg, funcBtnOk = () => this.$bvModal.hide(this.home.alert.id)) {
            this.home.alert.title = title;
            this.home.alert.msg = msg;
            this.home.alert.funcOnClick = funcBtnOk;
            this.$bvModal.show(this.home.alert.id);
        },

        logout() {
            this.$bvModal.msgBoxConfirm('Realmente deseja sair?', {
                title: "Por favor, confirme",
                okVariant: 'danger',
                okTitle: 'Sim',
                cancelTitle: 'Não',
                centered: true
            })
            .then(value => {
                if (value) {
                    localStorage.setItem('token', undefined);
                    this.$router.push({ name: 'login' });
                }
            })
        }

    }

}
</script>

<style scoped>

</style>