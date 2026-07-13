package com.ravenblog.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Configuration
@Profile("!test")
public class DatabaseConfig {

    /**
     * Builds the JDBC datasource exclusively from the existing Node.js DATABASE_URL.
     * Supported formats are jdbc:postgresql://... and postgresql://user:password@host/database.
     */
    @Bean
    DataSource dataSource(@Value("${DATABASE_URL}") String databaseUrl) {
        HikariDataSource dataSource = new HikariDataSource();

        if (databaseUrl.startsWith("jdbc:postgresql:")) {
            dataSource.setJdbcUrl(databaseUrl);
            return dataSource;
        }

        URI uri = URI.create(databaseUrl);
        if (!"postgres".equals(uri.getScheme()) && !"postgresql".equals(uri.getScheme())) {
            throw new IllegalStateException(
                    "DATABASE_URL must be a direct PostgreSQL URL (postgresql://... or jdbc:postgresql://...), not a Prisma Accelerate URL"
            );
        }
        if (uri.getHost() == null || uri.getRawPath() == null || uri.getRawPath().length() <= 1 || uri.getRawUserInfo() == null) {
            throw new IllegalStateException("DATABASE_URL must include host, database, username, and password");
        }

        String[] credentials = uri.getRawUserInfo().split(":", 2);
        if (credentials.length != 2) {
            throw new IllegalStateException("DATABASE_URL must include a username and password");
        }

        StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://")
                .append(uri.getHost());
        if (uri.getPort() != -1) {
            jdbcUrl.append(':').append(uri.getPort());
        }
        jdbcUrl.append(uri.getRawPath());
        if (uri.getRawQuery() != null) {
            jdbcUrl.append('?').append(uri.getRawQuery());
        }

        dataSource.setJdbcUrl(jdbcUrl.toString());
        dataSource.setUsername(decode(credentials[0]));
        dataSource.setPassword(decode(credentials[1]));
        return dataSource;
    }

    private String decode(String value) {
        // In a URI, '+' is a valid literal character; URLDecoder would otherwise turn it into a space.
        return URLDecoder.decode(value.replace("+", "%2B"), StandardCharsets.UTF_8);
    }
}
