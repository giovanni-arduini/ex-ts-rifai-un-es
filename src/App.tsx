import "./App.css";

type Destination = {
  name: string;
  country: string;
};

type Weather = {
  temperature: string;
  weather_description: string;
};

type Airports = {
  airport: string;
};

type CityData = Destination & Weather & Airports & {};

function App() {
  async function fetchPromise(url: string): Promise<object | null> {
    try {
      const response = await fetch(url);
      const data: unknown = await response.json();
      if (!data) {
        throw new Error("Formato dei dati non valido");
      }
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function getDashboardData(query: string): Promise<object | undefined> {
    const detinationsPromise: Promise<object | null> = fetchPromise(
      `https://boolean-spec-frontend.vercel.app/freetestapi/destinations?search=${query}`
    );
    const weathersPromise: Promise<object | null> = fetchPromise(
      `https://boolean-spec-frontend.vercel.app/freetestapi/weathers?search=${query}`
    );
    const airportsPromise: Promise<object | null> = fetchPromise(
      `https://boolean-spec-frontend.vercel.app/freetestapi/airports?search=${query}`
    );

    const promises: Promise<object | null>[] = [
      detinationsPromise,
      weathersPromise,
      airportsPromise,
    ];

    const resolve = await Promise.all(promises);

    function isCityData(data: unknown): data is CityData {
      return (
        typeof data === "object" &&
        data !== null &&
        "name" in data &&
        typeof data.name === "string" &&
        "country" in data &&
        typeof data.name === "string" &&
        "temperature" in data &&
        typeof data.temperature === "number" &&
        "weather_description" in data &&
        typeof data.weather_description === "string" &&
        "airport" in data &&
        typeof data.airport === "string"
      );
    }

    // function isWeather(data: unknown): data is Destination {
    //   return (
    //     typeof data === "object" &&
    //     data !== null &&
    //     "temperature" in data &&
    //     typeof data.temperature === "number" &&
    //     "weather_description" in data &&
    //     typeof data.weather_description === "string"
    //   );
    // }

    // function isAirports(data: unknown): data is Destination {
    //   return (
    //     typeof data === "object" &&
    //     data !== null &&
    //     "airport" in data &&
    //     typeof data.airport === "string"
    //   );
    // }

    if (isCityData(resolve)) {
      const result: CityData = {
        name: resolve.name,
        country: resolve.country,
        temperature: resolve.temperature,
        weather_description: resolve.weather_description,
        airport: resolve.airport,
      };

      return result;
    }
  }

  console.log(getDashboardData("london"));
  return <>Ciao mondo!</>;
}

export default App;
