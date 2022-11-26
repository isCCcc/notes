class Vue {
    constructor(options) {
        this.$el = document.querySelector(options.el)
        this.$data = options.data
        console.log(this.$el);
        console.log(this.$data);
    }
}