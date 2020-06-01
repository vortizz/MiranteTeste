<template>
  
    <div>

        <alert :id="alert.id" :title="alert.title" :msg="alert.msg" :funcOnClick="alert.funcOnClick" />

        <b-card no-body class="ml-auto mr-auto mt-5 shadow" style="max-width: 850px;">
            <b-card-body title="Cadastro" class="ml-3 mt-3 pb-5 pr-5 text-pink">
                
                <b-form @submit.prevent="onSubmit()" class="mt-5 ml-4">

                    <b-form-group label="Razão social:">
                        <b-form-input type="text" class="w-100" name="name" autocomplete="off"
                            v-model="comp.name" v-validate="{ required: true, min: 3, max: 100 }" 
                            data-vv-as="Razão social">
                        </b-form-input>
                    </b-form-group>

                    <b-form-group label="CNPJ:">
                        <b-form-input type="text" class="w-100" name="nrle" autocomplete="off"
                            v-model="comp.nrle" v-mask="'##.###.###/####-##'" v-validate="{ required: true }" 
                            data-vv-as="CNPJ">
                        </b-form-input>
                    </b-form-group>

                    <b-form-group label="Email:">
                        <b-form-input type="text" class="w-100" name="email" autocomplete="off"
                            v-model="comp.email" v-validate="{ required: true, email: true }" 
                            data-vv-as="Email">
                        </b-form-input>
                    </b-form-group>

                    <b-form-group label="Senha:">
                        <b-form-input type="password" class="w-100" name="password" autocomplete="off"
                            v-model="comp.password" v-validate="{ required: true, min: 5 }" 
                            data-vv-as="Senha">
                        </b-form-input>
                    </b-form-group>

                    <b-row class="mt-5">
                        <b-col sm="6">
                            <b-link :to="{ name: 'login' }" style="text-decoration: none!important">
                                <b-button type="submit" class="w-50 d-block mr-auto ml-auto">
                                    Ir para Login
                                </b-button>
                            </b-link>
                        </b-col>

                        <b-col sm="6">
                            <b-button type="submit" variant="primary" class="w-50 d-block mr-auto ml-auto">
                                <b-spinner variant="light" small v-if="showSpinner"></b-spinner>
                                <span v-else>Cadastrar</span>
                            </b-button>
                        </b-col>
                    </b-row>

                </b-form>

            </b-card-body>
        </b-card>

    </div>

</template>

<script>
import Company from "../../domain/company/Company";
import CompanyService from "../../domain/company/CompanyService";
import { isNRLE } from "../../utils/several";
import Alert from "../shared/Alert.vue";

export default {

    components: {
        'alert': Alert
    },

    data() {
        return {
            comp: new Company(),
            showSpinner: false,
            alert: {
                id: 'mAlertRCy',
                title: '',
                msg: '',
                funcOnClick: () => {}
            }
        }
    },

    created() {
        this.service = new CompanyService(this.$resource);
    },

    methods: {

        onSubmit() {
            this.$validator.validateAll().then(result => {  
                if (!result) {
                    this.veeErrors.items.forEach(error => {
                        this.makeToast(error.field, error.msg);
                    });
                    return;
                }
                let aNrle = this.comp.nrle.replace(/[.]+/g, '').replace('-', '').replace('/', '');
                if (!isNRLE(aNrle)) {
                    this.makeToast('nrle', 'Deve ser um CNPJ válido');
                    return;
                }

                this.showSpinner = true;

                this.service.register(this.comp)
                    .then(data => {
                        this.showSpinner = false;
                        let nameCy = data.body.data[0].name;
                        this.setInfoAlertAndCall('Cadastrado com sucesso', `Bem vindo ${nameCy}`, () => {
                            this.$router.push({ name: 'login' })
                        });
                    })
                    .catch(err => {
                        this.showSpinner = false;
                        let { status, message } = err.body;
                        if (status == 422) {
                            message.forEach(error => {
                                this.makeToast(error.param, error.msg);
                            });
                            return;
                        }
                        this.setInfoAlertAndCall('Erro', 'Erro ao cadastrar a empresa');
                    });

            })
        },

        setInfoAlertAndCall(title, msg, funcBtnOk = () => this.$bvModal.hide(this.alert.id)) {
            this.alert.title = title;
            this.alert.msg = msg;
            this.alert.funcOnClick = funcBtnOk;
            this.$bvModal.show(this.alert.id);
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
        }

    }

}
</script>

<style scoped>

</style>