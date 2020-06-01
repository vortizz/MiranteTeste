<template>
  
    <div>

        <alert :id="alert.id" :title="alert.title" :msg="alert.msg" :funcOnClick="alert.funcOnClick" />

        <b-modal id="mEditCustomer" centered hide-footer title="Editar">
            <b-form @submit.prevent="editCustomer()" class="ml-4 mr-4">

                <b-form-group label="Nome:">
                    <b-form-input type="text" class="w-100" name="name" autocomplete="off"
                        v-validate="{ required: true, min: 3, max: 100 }" v-model="customer.name"
                        data-vv-as="Nome">
                    </b-form-input>
                </b-form-group>

                <b-form-group label="CPF:">
                    <b-form-input type="text" class="w-100" name="ssn" autocomplete="off"
                        v-validate="{ required: true, min: 3, max: 100 }" v-mask="'###.###.###-##'"
                        data-vv-as="CPF" v-model="customer.ssn">
                    </b-form-input>
                </b-form-group>

                <b-form-group label="Celular:">
                    <b-form-input type="text" class="w-100" name="cell" autocomplete="off"
                        v-validate="{ required: true }" v-mask="'(##) #####-####'" 
                        data-vv-as="Celular" v-model="customer.cell">
                    </b-form-input>
                </b-form-group>

                <b-form-group label="Email:">
                    <b-form-input type="text" class="w-100" name="email" autocomplete="off"
                        v-validate="{ required: true, email: true }" 
                        data-vv-as="Email" v-model="customer.email">
                    </b-form-input>
                </b-form-group>

                <div class="mt-4 mb-3">
                    <b-button type="submit" variant="primary" class="w-50 d-block mr-auto ml-auto">
                        <b-spinner variant="light" small v-if="showSpinnerEc"></b-spinner>
                        <span v-else>Editar</span>
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

    props: {
        id: String,
        customer: {
            type: Object,
            default: new Customer()
        },
        btnOnSubmit: Function
    },

    components: {
        'alert': Alert
    },

    data() {
        return {
            showSpinnerEc: false,
            alert: {
                id: "mAlertEc",
                title: '',
                msg: '',
                funcOnClick: () => {}
            }
        }
    },

    created() {
        this.service = new CustomerService(this.$resource);
    },

    methods: {

        editCustomer() {
            this.$validator.validateAll().then(result => { 
                if (!result) {
                    this.veeErrors.items.forEach(error => {
                        this.makeToast(error.field, error.msg);
                    });
                    return;
                }

                let aSsn = this.customer.ssn.replace(/[.]+/g, '').replace('-', '');
                if (!isSSN(aSsn)) {
                    this.makeToast('ssn', 'Deve ser um CPF válido');
                    return;
                }

                this.showSpinnerEc = true;
                this.service.updt(this.id, this.customer)
                    .then(data => {
                        this.showSpinnerEc = false;
                        let nameCt = data.body.data[0].name;
                        this.$bvModal.hide('mEditCustomer');
                        this.setInfoAlertAndCall('Sucesso', `Cliente ${nameCt} editado(a) com sucesso!`);
                        //this.$router.push({ name: 'home' });
                    })
                    .catch(err => {
                        this.showSpinnerEc = false;
                        let { status, message } = err.body;
                        if (status == 422) {
                            message.forEach(error => {
                                this.makeToast(error.param, error.msg);
                            });
                            return;
                        }
                        this.$bvModal.hide('mEditCustomer');
                        if (status == 401) {
                            this.setInfoAlertAndCall('Vish...', 'Sessão expirada',  () => {
                                this.$router.push({ name: 'login' });
                            });
                            return;
                        }
                        this.setInfoAlertAndCall('Erro', 'Erro ao editar o cliente');
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