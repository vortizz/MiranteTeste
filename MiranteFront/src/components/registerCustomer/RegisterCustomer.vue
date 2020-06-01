<template>
  
    <div>

        <alert :id="alert.id" :title="alert.title" :msg="alert.msg" :funcOnClick="alert.funcOnClick" />

        <b-modal id="regCustomer" centered hide-footer title="Cadastro">
            <b-form @submit.prevent="registerCust()" class="ml-4 mr-4">

                <b-form-group label="Nome:">
                    <b-form-input type="text" class="w-100" name="name" autocomplete="off"
                        v-validate="{ required: true, min: 3, max: 100 }" v-model="cust.name"
                        data-vv-as="Nome">
                    </b-form-input>
                </b-form-group>

                <b-form-group label="CPF:">
                    <b-form-input type="text" class="w-100" name="ssn" autocomplete="off"
                        v-validate="{ required: true, min: 3, max: 100 }" v-mask="'###.###.###-##'"
                        data-vv-as="CPF" v-model="cust.ssn">
                    </b-form-input>
                </b-form-group>

                <b-form-group label="Celular:">
                    <b-form-input type="text" class="w-100" name="cell" autocomplete="off"
                        v-validate="{ required: true }" v-mask="'(##) #####-####'" 
                        data-vv-as="Celular" v-model="cust.cell">
                    </b-form-input>
                </b-form-group>

                <b-form-group label="Email:">
                    <b-form-input type="text" class="w-100" name="email" autocomplete="off"
                        v-validate="{ required: true, email: true }" 
                        data-vv-as="Email" v-model="cust.email">
                    </b-form-input>
                </b-form-group>

                <div class="mt-4 mb-3">
                    <b-button type="submit" variant="primary" class="w-50 d-block mr-auto ml-auto">
                        <b-spinner variant="light" small v-if="showSpinnerRc"></b-spinner>
                        <span v-else>Cadastrar</span>
                    </b-button>
                </div>

            </b-form>
        </b-modal>

    </div>

</template>

<script>
import Customer from "../../domain/customer/Customer";
import CustomerService from "../../domain/customer/CustomerService";
import { isSSN } from "../../utils/several";
import Alert from "../shared/Alert.vue";

export default {

    components: {
        'alert': Alert
    },

    data() {
        return {
            cust: new Customer(),
            showSpinnerRc: false,
            alert: {
                id: 'mAlertRc',
                title: '',
                msg: '',
                funcOnClick: () => {}
            }
        }
    },
    
    created() {
        let authToken = localStorage.getItem('token');        
        this.cust.authToken = authToken;
        this.service = new CustomerService(this.$resource);
    },

    methods: {

        registerCust() {
            this.$validator.validateAll().then(result => { 
                if (!result) {
                    this.veeErrors.items.forEach(error => {
                        this.makeToast(error.field, error.msg);
                    });
                    return;
                }

                let aSsn = this.cust.ssn.replace(/[.]+/g, '').replace('-', '');
                if (!isSSN(aSsn)) {
                    this.makeToast('ssn', 'Deve ser um CPF válido');
                    return;
                }

                this.showSpinnerRc = true;

                this.service.register(this.cust)
                    .then(data => {
                        this.showSpinnerRc = false;
                        let nameCt = data.body.data[0].name;
                        this.$bvModal.hide('regCustomer');
                        this.setInfoAlertAndCall('Sucesso', `Cliente ${nameCt} cadastrada(o) com sucesso!`, () => {
                            this.$router.go(0);
                        });
                    })
                    .catch(err => {
                        this.showSpinnerRc = false;
                        let { status, message } = err.body;
                        if (status == 422) {
                            message.forEach(error => {
                                this.makeToast(error.param, error.msg);
                            });
                            return;
                        }
                        this.$bvModal.hide('regCustomer');
                        if (status == 401) {
                            this.setInfoAlertAndCall('Vish...', 'Sessão expirada',  () => {
                                this.$router.push({ name: 'login' });
                            });
                            return;
                        }
                        this.setInfoAlertAndCall('Erro', 'Erro ao cadastrar o cliente');
                    });

            });
        },

        makeToast(field, msg) {
            const doc = document.getElementsByName(field);
            const fieldName = doc[0].dataset.vvAs;
            this.$bvToast.toast(msg, {
                title: `Campo ${fieldName}`,
                variant: 'danger',
                toaster: 'b-toaster-bottom-left',
                autoHideDelay: 5000
            });
        },

        setInfoAlertAndCall(title, msg, funcBtnOk = () => this.$bvModal.hide(this.alert.id)) {
            this.alert.title = title;
            this.alert.msg = msg;
            this.alert.funcOnClick = funcBtnOk;
            this.$bvModal.show(this.alert.id);
        },


    }

}
</script>

<style scoped>

</style>