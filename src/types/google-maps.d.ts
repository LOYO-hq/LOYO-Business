declare global {
  interface Window {
    google: {
      maps: {
        Map: any;
        places: {
          AutocompleteService: any;
          PlacesService: any;
          PlacesServiceStatus: {
            OK: string;
          };
        };
      };
    };
  }
}

export {};
