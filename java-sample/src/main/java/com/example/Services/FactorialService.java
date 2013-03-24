package com.example.services;

import com.example.models.FactorialCalculator;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.PathParam;

@Path("/factorial")
@Produces(MediaType.APPLICATION_JSON)
public class FactorialService {

    @GET
    @Path("{num}")
    public String getFactorial(@PathParam("num") int num) {
        return FactorialCalculator.calculate ( num );
    }

}


