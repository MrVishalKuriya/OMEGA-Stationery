package com.omega.stationery.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

import java.util.concurrent.TimeUnit;

@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Value("${spring.data.mongodb.uri:mongodb://localhost:27017/omega_stationery}")
    private String mongoUri;

    @Override
    protected String getDatabaseName() {
        try {
            ConnectionString connectionString = new ConnectionString(mongoUri);
            String db = connectionString.getDatabase();
            return (db != null && !db.trim().isEmpty()) ? db : "omega_stationery";
        } catch (Exception e) {
            return "omega_stationery";
        }
    }

    @Override
    protected void configureClientSettings(MongoClientSettings.Builder builder) {
        ConnectionString connectionString = new ConnectionString(mongoUri);
        builder.applyConnectionString(connectionString)
               .applyToSocketSettings(socket -> {
                   socket.connectTimeout(10, TimeUnit.SECONDS);
                   socket.readTimeout(15, TimeUnit.SECONDS);
               })
               .applyToClusterSettings(cluster -> {
                   cluster.serverSelectionTimeout(10, TimeUnit.SECONDS);
               });
    }

    @Override
    protected boolean autoIndexCreation() {
        return false;
    }
}
