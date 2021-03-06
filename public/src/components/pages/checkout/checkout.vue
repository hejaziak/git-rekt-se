<template>
  <div class="checkout">
    <serviceInfoHeader :service="service"></serviceInfoHeader>

    <!--- Checkout Steps -->
    <div class="stepper">
      <el-steps space="50%" :active="active" :center="true" :align-center="true">

        <a href="#" @click.prevent="goToStep1">
          <el-step icon="edit">
            <div slot="title">
              <el-tooltip class="item" content="Select Offering" placement="bottom">
                <span>Select</span>
              </el-tooltip>
            </div>
          </el-step>
        </a>

        <el-step icon="document">
          <div slot="title">
            <el-tooltip class="item" content="Review Booking Information" placement="bottom">
              <span>Review</span>
            </el-tooltip>
          </div>
        </el-step>

        <el-step icon="check">
          <div slot="title">
            <el-tooltip class="item" content="Finish Booking" placement="bottom">
              <span>Finish</span>
            </el-tooltip>
          </div>
        </el-step>

      </el-steps>
    </div>

    <div class="columns checkout-boxes">

      <checkoutStep1 class="column is-10 is-offset-1" :form="form" :service="service"
                     v-show="active === 1"
                     @reviewBooking="goToStep2" :active="active"></checkoutStep1>
      <checkoutStep2 class="column is-12 columns " :service="service" :form="form"
                     v-show="active === 2"
                     @tokenGenerated="makeTransaction" @returnStep1="goToStep1"></checkoutStep2>
      <checkoutStep3 v-if="active === 3"></checkoutStep3>
    </div>
  </div>
</template>

<script>
  /**
   * This component is represents checkout/booking.
   */
  import axios from 'axios';
  import { Visitor, Service } from '../../../services/EndPoints';
  import serviceInfoHeader from './serviceInfoHeader.vue';
  import checkoutStep1 from './checkoutStep1.vue';
  import checkoutStep2 from './checkoutStep2.vue';
  import checkoutStep3 from './checkoutStep3.vue';
  import clientAuth from '../../../services/auth/clientAuth';
  import commonAuth from '../../../services/auth/commonAuth';

  export default {
    /**
     * Sub-components, Any components used by this component.
     */
    components: {
      serviceInfoHeader,
      checkoutStep1,
      checkoutStep2,
      checkoutStep3,
    },
    /**
     * Data Used By The Component.
     */
    data() {
      return {
        active: 1,
        form: {
          branch: '',
          offering: '',
          coupon: '',
          token: '',
        },
        service: '',
        loader: '',
      };
    },
    /**
     * Computed properties.
     */
    computed: {
      toolTipContent() {
        if (this.active === 1) {
          return 'Select Timing';
        }
        return 'Go back to step 1';
      },
    },
     /**
     * Declare all methods used by the component here.
     */
    methods: {
      /**
       * Get the service info with `ser_id`.
       */
      getService() {
        this.loader = this.$loading({
          fullscreen: true,
        });

        const url = Visitor().viewService(this.$route.params.ser_id);
        axios
            .get(url)
            .then((req) => {
              this.service = req.data;
              this.loader.close();
            })
            .catch((e) => {
              this.$router.push('/');
              this.$toast.open({
                message: e.response.data.errors[0],
                type: 'is-danger',
                position: 'bottom',
              });

              this.loader.close();
            });
      },
      /**
       * Handle tooltips viewed when hovering over steps.
       */
      handleTooltip() {
        if (this.active === 2) {
          this.goToStep1();
        }
      },
      /**
       * Return back to step 1
       */
      goToStep1() {
        if (this.active === 2) {
          this.form.offering = '';
          this.form.branch = '';
          this.active = 1;
        }
      },
      /**
       * Make the change between steps smoother.
       */
      goToStep2() {
        setTimeout(() => {
          this.active = 2;
        }, 500);
      },
      /**
       * Book for the service.
       */
      makeTransaction() {
        this.loader = this.$loading({
          fullscreen: true,
        });

        const url = Service().makeBooking;
        axios
            .post(url, {
              service: this.$route.params.ser_id,
              offering: this.form.offering._id,
              coupon: this.form.coupon._id,
              token: this.form.token,
            }, {
              headers: {
                Authorization: clientAuth.getJWTtoken(),
              },
            })
            .then(() => {
              this.active = 3;
              this.loader.close();
            }).catch(() => {
              this.loader.close();
            });
      },
    },
    /**
     * Ran when component is mounted on the DOM.
     * If user is not authenticated he should be allowed
     * to book.
     */
    mounted() {
      clientAuth.refreshAuth();
      if (!clientAuth.user.authenticated) {
        this.$toast.open({
          message: 'You must be logged as a client to view this page.',
          type: 'is-danger',
          position: 'bottom',
        });
        if (commonAuth.isAuthenticated()) {
          this.$router.push('/');
        } else {
          this.$router.push('/client/login');
        }

        return;
      }

      this.loader = this.$loading({
        fullscreen: true,
      });
      this.getService();
    },
  };
</script>

<style>
  .stepper {
    padding: 0em 5em 2em 5em;
  }

  .checkout-top {
    background: #CB356B; /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #BD3F32, #CB356B); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #BD3F32, #CB356B); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    margin-bottom: 2em;
  }

  .checkout-boxes {
    margin-bottom: 2em !important;
  }

  .el-rate__icon {
    font-size: 24px;
  }

  .shortDescription {
    font-size: 0.8em;
  }

  .seventy-width {
    width: 70%;
  }

  .label {
    width: 100%;
    margin-bottom: 0.3em;
  }

  .StripeElement {
    background-color: #fff;
    padding: 10px 8px;
  }

  @media screen and (max-width: 999px) {
    .service-info-header {
      padding: 2em;
    }

    .box {
      margin: 0.3em;
    }
  }
</style>
