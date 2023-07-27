import { shallowMount } from '@vue/test-utils'
import PathFinder from "@/components/PathFinder.vue";


describe('PathFinder', () => {
    it('renders canvas', () => {
        const ehost = 'http://mproxy.hotelmatrix.report/prolog/path'
        const wrapper = shallowMount(PathFinder, {
            props: { ehost }
        })
        expect( wrapper.vm.$data.canvasw ).toBe(780);
    })

    it('reset initial array', () => {
        const wrapper = shallowMount(PathFinder, {
            props: { ehost: 'http://mproxy.hotelmatrix.report/prolog/path' }
        })
        expect( wrapper.vm.$data.paths.length ).toBeGreaterThan(0);
        wrapper.find('[data-test="reset"]').trigger('click');
        expect( wrapper.vm.$data.paths.length ).toBe(0);
    })

    it('insert new item 2 database',async () => {
        const wrapper = shallowMount(PathFinder, {
            props: { ehost: 'http://mproxy.hotelmatrix.report/prolog/path' }
        })
        wrapper.vm.clearAll();
        expect( wrapper.vm.$data.paths.length ).toBe(0);
        wrapper.vm.$data.showAddBtn = true;

        wrapper.vm.$nextTick(() => {
            wrapper.vm.$data.mformpoint = {from:'X',target:'Y',dist:1123 };
            wrapper.find('[data-test="add"]').trigger('click');
            expect( wrapper.vm.$data.paths.length ).toBe(1);
        })
    })

    it('insert new WRONG item 2 database',async () => {
        const wrapper = shallowMount(PathFinder, {
            props: { ehost: 'http://mproxy.hotelmatrix.report/prolog/path' }
        })
        wrapper.vm.clearAll();
        expect( wrapper.vm.$data.paths.length ).toBe(0);
        wrapper.vm.$data.showAddBtn = true;

        wrapper.vm.$nextTick(() => {
            wrapper.find('[data-test="add"]').trigger('click');
            expect( wrapper.vm.$data.paths.length ).toBe(0);
        })
    })
})
