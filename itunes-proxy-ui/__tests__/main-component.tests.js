import MainComponent from "../src/components/MainComponent.vue";
import { shallowMount } from "@vue/test-utils"
import axios from "axios";

jest.mock("axios");

describe('MainComponent', () => {
    it('should show a message if the input is empty', () => {
        // Arrange
        const wrapper = shallowMount(MainComponent);
        // Act
        // Assert
        expect(wrapper.find('#search-input').exists()).toBe(true);
        expect(wrapper.find('#trigger-button').exists()).toBe(true);
    })
    it('should show loading message when loading', () => {
        // Arrange
        const wrapper = shallowMount(MainComponent);
        // Act
        wrapper.setData({ loading: true, artistName: 'musial' });
        // Assert
        wrapper.vm.$nextTick(() => {
            expect(wrapper.find('div').text()).toContain('Loading...');
        });
      });
    it('should show a message if the search input is empty', () => {
        // Arrange
        const wrapper = shallowMount(MainComponent);
        // Act
        const searchInput = wrapper.find('#search-input');
        searchInput.setValue('');
        const triggerButton = wrapper.find('#trigger-button');
        triggerButton.trigger('click');
        // Assert
        wrapper.vm.$nextTick(() => {
            const errorMessage = wrapper.find('#error-message');
            expect(errorMessage.exists()).toBe(true);
        });
    });
    it('should show a container with id results and two divs with id results-item when searched an existing artist with 2 albums', async () => {
        // Arrange
        const wrapper = shallowMount(MainComponent);
        const searchInput = wrapper.find('#search-input');
        searchInput.setValue('musial');
        const triggerButton = wrapper.find('#trigger-button');
        axios.get.mockResolvedValue({
            data: {
                items: [
                    {
                        albumUrl: 'http://album.com',
                        albumName: 'album-test-1',
                        artistName: 'musial',
                        artworkUrl100: 'https://via.placeholder.com/100',
                    },
                    {
                        albumUrl: 'http://album2.com',
                        albumName: 'album-test-2',
                        artistName: 'musial',
                        artworkUrl100: 'https://via.placeholder.com/100',
                    },
                ],
            },
        });
        // Act
        triggerButton.trigger('click');
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        // Assert
        const resultsContainer = wrapper.find('#results');
        const resultsItems = wrapper.findAll('#results-item');
        expect(resultsContainer.exists()).toBe(true);
        expect(resultsItems.length).toBe(2);
    })
});