import { TourDetails, TourDate, TourPrice } from '../models/visitate';
import { EventDocument, EventInfo, TicketType, TicketTypeInfo } from '../models/mongodb';

export class DataMapper {
  /**
   * Maps data from Visitate API to MongoDB document format
   * 
   * @param tourDetails The tour details from Visitate API
   * @param tourDates The tour dates from Visitate API
   * @returns MongoDB event document
   */
  mapToMongoDocument(tourDetails: TourDetails, tourDates: TourDate[]): EventDocument[] {
    // Sort tour dates by date (ascending) to find the first upcoming event
    const sortedTourDates = [...tourDates].sort((a, b) => a.from - b.from);
    const firstUpcomingEventId = sortedTourDates.length > 0 ? sortedTourDates[0].id : null;
    
    // Create an array of event documents, one for each tour date
    return tourDates.map(tourDate => {
      const eventId = tourDate.id;
      const isPremiere = eventId === firstUpcomingEventId;

      // Create base event document
      const eventDocument: EventDocument = {
        _id: eventId,
        defaultLanguageId: 1, // Default to German as requested
        organizerId: 1767019, // Using the same value from the example
        status: 0,
        maxTickets: tourDetails.max_participants,
        maxTicketsProOrder: 10,
        countryId: 176, // Switzerland
        openDoor: new Date((tourDate.from - 1800) * 1000), // 30 minutes before start
        start: new Date(tourDate.from * 1000),
        end: new Date(tourDate.to * 1000),
        eventGenreValue: 145,
        googleCoordinates: '',
        isActiveForSale: true,
        googleAnalyticsTracker: isPremiere ? 'Premiere' : tourDetails.name,
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
        notificationEmail: this.extractEmailFromDescription(tourDetails.description_long) || 'info@petruschka.ch',
        vatNumber: '',
        sendWarning: false,
        salesWarningLevel: 0,
        warningSendDate: '',
        salesRegionId: 1,
        emailTemplate: '',
        showLinkToGoogleMap: false,
        latitude: -1.7976931348623157e+308,
        longitude: -1.7976931348623157e+308,
        facebookPixelId: '2025w', // As requested
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
  private createEventInfos(tourDetails: TourDetails): EventInfo[] {
    // Just create one event info for German language (languageId = 0)
    const eventInfo: EventInfo = {
      _id: Math.floor(Math.random() * 1000000), // Generate a random ID
      organizerName: null,
      name: tourDetails.name,
      shortDescription: tourDetails.description_short,
      importantNotes: '',
      longDescription: tourDetails.description_long,
      artists: '', // No direct mapping for artists
      url: '', // No direct mapping for URL
      city: tourDetails.venue_name, // Use venue name as city
      location: tourDetails.venue_name,
      address: tourDetails.meeting_point,
      postalCode: null,
      bannerImagePath: tourDetails.image_url,
      flyerImagePath: tourDetails.image_url,
      bannerImage: tourDetails.image_url.split('/').pop() || '',
      flyerImage: tourDetails.image_url.split('/').pop() || '',
      languageId: 0, // German only as requested
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
  private createTicketTypes(tourDetails: TourDetails, tourDate: TourDate): TicketType[] {
    return tourDetails.prices_online.map((price, index) => {
      const ticketTypeId = Math.floor(Math.random() * 1000000); // Generate a random ID
      
      const ticketType: TicketType = {
        _id: ticketTypeId,
        eventId: tourDate.id,
        ticketsTotal: tourDate.part,
        currency: 'CHF',
        price: price.amount / 100, // Convert from cents to whole currency unit
        start: new Date(tourDate.from * 1000),
        end: new Date(tourDate.to * 1000),
        vatTypeId: 3,
        vatPercentage: 0,
        maxMemberTickets: 0,
        bookWithTicketTypeId: -2147483648,
        sortOrder: index + 1,
        preSaleStart: new Date(tourDate.from * 1000), // Same as event start for simplicity
        preSaleEnd: new Date(tourDate.from * 1000),
        openDoor: new Date((tourDate.from - 1800) * 1000), // 30 minutes before start
        invoiceEnd: new Date((tourDate.from - 864000) * 1000), // 10 days before event
        callcenterEnd: new Date(-62135596800000),
        sofortEnd: new Date((tourDate.from - 432000) * 1000), // 5 days before event
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
  /**
   * Extracts an email address from HTML description
   * 
   * @param description HTML description text
   * @returns Email address if found, otherwise null
   */
  private extractEmailFromDescription(description: string): string | null {
    // Look for email pattern in an href="mailto:" link
    const mailtoRegex = /href="mailto:([^"]+)"/i;
    const mailtoMatch = description.match(mailtoRegex);
    if (mailtoMatch && mailtoMatch[1]) {
      return mailtoMatch[1];
    }
    
    // Look for a standard email pattern as fallback
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emailMatches = description.match(emailRegex);
    if (emailMatches && emailMatches.length > 0) {
      return emailMatches[0];
    }
    
    return null;
  }

  private createTicketTypeInfos(price: TourPrice, ticketTypeId: number): TicketTypeInfo[] {
    // Just create one ticket type info for German language (languageId = 0)
    const ticketTypeInfo: TicketTypeInfo = {
      _id: Math.floor(Math.random() * 1000000), // Generate a random ID
      name: price.name,
      languageId: 0, // German only as requested
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