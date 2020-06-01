<template>
  
    <div>
        <alert :id="alert.id" :title="alert.title" :msg="alert.msg" :funcOnClick="alert.funcOnClick" />

        <b-card no-body class="main shadow" style="max-width: 550px;">
            <b-card-body title="Entrar" class="ml-3 mt-3 pb-5 pr-5 text-pink">
                
                <b-form @submit.prevent="onSubmit()" class="mt-5 ml-4">
                    
                    <b-form-group label="Email:">
                    <b-form-input id="email" type="text" placeholder="nome@exemplo.com" class="w-100"
                        name="email" v-model="login.email" v-validate="{ required: true, email: true }" data-vv-as="Email">
                    </b-form-input>
                    </b-form-group>

                    <b-form-group label="Senha:">
                    <b-form-input id="input-2" type="password" placeholder="**********" class="w-100"
                        name="password" v-model="login.password" v-validate="{ required: true }" autocomplete="off"
                        data-vv-as="Senha">
                    </b-form-input>
                    </b-form-group>

                    <b-row class="mt-5">
                        <b-col sm="6">
                            <b-link :to="{ name: 'registerCompany' }" style="text-decoration: none!important">
                                <b-button type="submit" class="w-100 d-block mr-auto ml-auto">
                                    Cadastre-se
                                </b-button>
                            </b-link>
                        </b-col>

                        <b-col sm="6">

                            <b-button type="submit" variant="primary" class="w-100 d-block mr-auto ml-auto">
                                <b-spinner variant="light" small v-if="showSpinner"></b-spinner>
                                <span v-else>Entrar</span>
                            </b-button>
                        </b-col>
                    </b-row>

                </b-form>

            </b-card-body>
        </b-card>

    </div>

</template>

<script>
import Login from "../../domain/login/Login";
import LoginService from "../../domain/login/LoginService";
import Alert from "../shared/Alert.vue";

export default {

    components: {
        'alert': Alert
    },

    data() {
        return {
            showSpinner: false,
            login: new Login(),
            alert: {
                id: "mAlertLogin",
                title: '',
                msg: '',
                funcOnClick: () => {}
            }
        }
    },

    created() {
        this.service = new LoginService(this.$resource);
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
                
                this.showSpinner = true;

                this.service.access(this.login)
                    .then(data => {
                        this.showSpinner = false;
                        let token = data.body.data.token;
                        if (token) {
                            localStorage.setItem('token', token);
                            this.$router.push({ name: 'home' });
                        }
                    })
                    .catch(err => {
                        this.showSpinner = false;
                        let { status, messages } = err.body;
                        if (status == 422) {
                            messages.forEach(error => {
                                this.makeToast(error.param, error.msg);
                            });
                            return;
                        } else if (status == 404) {
                            this.setInfoAlertAndCall('Vish', 'Email e senha estão incorretos');
                            return;
                        }              
                        this.setInfoAlertAndCall('Erro', 'Erro ao acessar a conta da empresa');
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
            this.$bvModal.show(this.alert.id)
        },

    }

}
</script>

<style scoped>

    .main {
        min-width: 30rem!important;
        position: absolute;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

</style>