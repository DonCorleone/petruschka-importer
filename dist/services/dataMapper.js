"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataMapper = void 0;
class DataMapper {
    /**
     * Maps data from Visitate API to MongoDB document format
     *
     * @param tourDetails The tour details from Visitate API
     * @param tourDates The tour dates from Visitate API
     * @returns MongoDB event document
     */
    mapToMongoDocument(tourDetails, tourDates) {
        // Create an array of event documents, one for each tour date
        return tourDates.map(tourDate => {
            const eventId = tourDate.id;
            // Create base event document
            const eventDocument = {
                _id: eventId,
                defaultLanguageId: 1,
                organizerId: 1767019,
                status: 0,
                maxTickets: tourDetails.max_participants,
                maxTicketsProOrder: 10,
                countryId: 176,
                openDoor: new Date((tourDate.from - 1800) * 1000),
                start: new Date(tourDate.from * 1000),
                end: new Date(tourDate.to * 1000),
                eventGenreValue: 145,
                googleCoordinates: '',
                isActiveForSale: true,
                googleAnalyticsTracker: tourDetails.name,
                hideOnEventList: false,
                hideEventInfoOnSoldOut: false,
                dateCreated: new Date(),
                dateModified: new Date(),
                zoneMapId: -2147483648,
                postSaleCloseStatus: 1,
                masterEventId: -2147483648,
                organizerGoogleAnalyticsDomain: '',
                isCompanyNameMandatory: false,
                isPhoneMandatory: false,
                tenantId: 1,
                locationId: -2147483648,
                noVatOnCommission: false,
                shippingFee: 0,
                sendNotificationByEmail: true,
                notificationEmail: '',
                vatNumber: '',
                sendWarning: false,
                salesWarningLevel: 0,
                warningSendDate: '',
                salesRegionId: 1,
                emailTemplate: '',
                showLinkToGoogleMap: false,
                latitude: -1.7976931348623157e+308,
                longitude: -1.7976931348623157e+308,
                facebookPixelId: '2025w',
                stay22Active: true,
                isBankInternalEvent: false,
                externalEventCode: '',
                forceEmptySeats: 0,
                eventInfos: this.createEventInfos(tourDetails),
                ticketTypes: this.createTicketTypes(tourDetails, tourDate)
            };
            return eventDocument;
        });
    }
    /**
     * Creates event info objects from tour details
     *
     * @param tourDetails The tour details from Visitate API
     * @returns Array of event info objects
     */
    createEventInfos(tourDetails) {
        // Just create one event info for German language (languageId = 0)
        const eventInfo = {
            _id: Math.floor(Math.random() * 1000000),
            organizerName: null,
            name: tourDetails.name,
            shortDescription: tourDetails.description_short,
            importantNotes: '',
            longDescription: tourDetails.description_long,
            artists: '',
            url: '',
            city: tourDetails.venue_name,
            location: tourDetails.venue_name,
            address: tourDetails.meeting_point,
            postalCode: null,
            bannerImagePath: tourDetails.image_url,
            flyerImagePath: tourDetails.image_url,
            bannerImage: tourDetails.image_url.split('/').pop() || '',
            flyerImage: tourDetails.image_url.split('/').pop() || '',
            languageId: 0,
            languageIsoCode: null,
            googleMapLink: '',
            organizerRemark: '',
            posRemark: ''
        };
        return [eventInfo];
    }
    /**
     * Creates ticket type objects from tour details and date
     *
     * @param tourDetails The tour details from Visitate API
     * @param tourDate The tour date from Visitate API
     * @returns Array of ticket type objects
     */
    createTicketTypes(tourDetails, tourDate) {
        return tourDetails.prices_online.map((price, index) => {
            const ticketTypeId = Math.floor(Math.random() * 1000000); // Generate a random ID
            const ticketType = {
                _id: ticketTypeId,
                eventId: tourDate.id,
                ticketsTotal: tourDate.part,
                currency: 'CHF',
                price: price.amount / 100,
                start: new Date(tourDate.from * 1000),
                end: new Date(tourDate.to * 1000),
                vatTypeId: 3,
                vatPercentage: 0,
                maxMemberTickets: 0,
                bookWithTicketTypeId: -2147483648,
                sortOrder: index + 1,
                preSaleStart: new Date(tourDate.from * 1000),
                preSaleEnd: new Date(tourDate.from * 1000),
                openDoor: new Date((tourDate.from - 1800) * 1000),
                invoiceEnd: new Date((tourDate.from - 864000) * 1000),
                callcenterEnd: new Date(-62135596800000),
                sofortEnd: new Date((tourDate.from - 432000) * 1000),
                promoCodeIdToPrint: 0,
                ticketTemplate: 'newStandardTop',
                maxNumberOfTicketsPerOrder: 10,
                numberOfTicketsToBasket: 1,
                festivalEventIds: '',
                hidePriceOnTicket: false,
                hideOnPcClient: false,
                generateNoTicket: false,
                ticketByEmail: false,
                hideReceipt: false,
                noConfirmationEmail: false,
                useWorkflow: false,
                companyRequired: false,
                companyMandatory: false,
                firstNameRequired: false,
                firstNameMandatory: false,
                nameRequired: false,
                nameMandatory: false,
                birthDateRequired: false,
                birthDateMandatory: false,
                addressRequired: false,
                postalCodeAndCityRequired: false,
                addressMandatory: false,
                postalCodeAndCityMandatory: false,
                emailRequired: false,
                emailMandatory: false,
                isActive: true,
                hideDateTime: false,
                isOverheadCalculateActive: false,
                numberOfTicketsSold: 0,
                colorCode: '',
                isSoldOut: false,
                showImageOnTop: false,
                blockAutoMailer: false,
                dontShowInsurance: false,
                vatInGivenAmount: '-79228162514264337593543950335',
                senderEmail: '',
                replyTo: '',
                emailTemplate: '',
                modifiedDate: new Date(),
                dateCreated: new Date(),
                hidePassbook: false,
                externalTicketCode: '',
                sendSMSOrder: false,
                phoneRequired: false,
                phoneMandatory: false,
                ticketTypeInfos: this.createTicketTypeInfos(price, ticketTypeId)
            };
            return ticketType;
        });
    }
    /**
     * Creates ticket type info objects from tour price
     *
     * @param price The tour price from Visitate API
     * @param ticketTypeId The parent ticket type ID
     * @returns Array of ticket type info objects
     */
    createTicketTypeInfos(price, ticketTypeId) {
        // Just create one ticket type info for German language (languageId = 0)
        const ticketTypeInfo = {
            _id: Math.floor(Math.random() * 1000000),
            name: price.name,
            languageId: 0,
            description: price.description_long,
            imageUrl: '',
            image: '',
            additionalFile: '',
            additionalFileUrl: '',
            alternateImageUrl: '',
            customtext1: null,
            customtext2: null,
            customtext3: null,
            customtext4: null,
            customtext1Mandatory: false,
            customtext2Mandatory: false,
            originalFileData: '',
            originalImageData: '',
            croppedImageData: '',
            ticketTypeId: ticketTypeId,
            presentation: '',
            deleted: false,
            emailSubject: '',
            senderName: '',
            modifiedDate: new Date()
        };
        return [ticketTypeInfo];
    }
}
exports.DataMapper = DataMapper;
