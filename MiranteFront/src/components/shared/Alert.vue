<template>
  
    <b-modal :id="id" centered :title="title">
        <p>{{ msg }}</p>
        <template v-slot:modal-footer>
            <div class="w-100">
                <b-button variant="primary" class="d-block ml-auto mr-auto w-25" @click="funcOnClick">Ok</b-button>
            </div>
        </template>
    </b-modal>

</template>

<script>
export default {

    props: {
        id: { type: String, required: true },
        title: String,
        msg: String,
        funcOnClick: Function
    }

}
</script>

<style>

</style>