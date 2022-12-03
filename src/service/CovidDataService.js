import axios from "axios";

export const CovidDataServive = {
    getAllCountyCases: function() {
        // return axios.get("https://corona.lmao.ninja/v2/jhucsse/counties")
        return axios.get("https://disease.sh/v3/covid-19/jhucsse/counties")
    }
}
