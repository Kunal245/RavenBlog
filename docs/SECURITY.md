# Security: Password Migration

## Why plaintext passwords existed

The original Hono/Prisma backend stores the submitted password directly in the PostgreSQL `"User".password` column during signup. During signin, it queries for a record using both the submitted email and submitted password. There is no password-hashing library or password encoder in the Node.js backend.

This is legacy behavior, not a safe authentication design. It also explains why the existing database may contain passwords that are readable as ordinary text.

## Automatic BCrypt migration in Spring Boot

The new Spring authentication module uses BCrypt for every new signup. On signin, it supports both database formats to enable a gradual migration without breaking existing accounts.

```text
1. Find the user by email.
2. Inspect the stored password value.
3. If it begins with $2a$, $2b$, or $2y$:
   - Treat it as a BCrypt hash.
   - Verify it with BCryptPasswordEncoder.matches().
4. Otherwise:
   - Treat it as legacy plaintext.
   - Compare it to the supplied password in constant time.
   - If it matches, replace the database value with a new BCrypt hash.
   - Commit that update as part of the successful signin transaction.
5. Issue the compatible HS256 JWT only after password verification succeeds.
```

The plaintext password is never returned to the client, logged by the Spring application, or written again by the Spring signup endpoint.

## When plaintext passwords will no longer exist

For an individual existing user, plaintext stops existing as soon as that user completes one successful signin through the Spring backend. The successful login upgrades only that user’s stored password to BCrypt.

Plaintext credentials will remain for dormant accounts that have not yet signed in through Spring. They can also continue to be created while the original Node.js signup endpoint remains active, because that endpoint still stores passwords as plaintext.

Therefore, plaintext passwords will be eliminated globally only after all of the following are true:

1. The Spring backend is the only backend serving signup/signin traffic, or the legacy signup route has otherwise been retired.
2. Every legacy account has signed in through Spring **or** has been handled through an approved forced-reset or controlled bulk-rehash process.
3. A database audit confirms no password column values remain outside the accepted BCrypt format.

A bulk rehash can hash existing plaintext database values directly, but it is a sensitive, one-time database operation and must be separately approved, tested on a backup, and performed without exposing values in logs or exports. A forced password reset is usually the safer option when the existing password data cannot be trusted.

## Security implications

- **Legacy database exposure is critical.** Anyone able to read the old `password` column can read every un-migrated user password. Those passwords may be reused on other services.
- **Automatic migration reduces future exposure but does not erase past exposure.** A password already accessed, copied, or leaked cannot be made secret by rehashing it later.
- **BCrypt is deliberately slow.** It makes offline password guessing materially harder than plaintext storage. Its cost factor should be reviewed periodically as infrastructure changes.
- **The current migration detector is prefix-based.** It recognizes `$2a$`, `$2b$`, and `$2y$`. A rare legacy plaintext password beginning with one of those prefixes could be misclassified as a hash and fail login. Before production cutover, the detector should be strengthened to validate the complete BCrypt hash format.
- **JWTs remain compatible, not fully hardened.** They use HS256 and an `id` claim to match the existing frontend/backend contract. They currently have no expiry, refresh flow, issuer, audience, or revocation mechanism. These should be added in a planned compatibility release.
- **JWT secrets need protection.** The existing `SECRET` must be stored in the deployment platform’s secret manager, be at least 32 UTF-8 bytes, and never be committed or logged. Spring intentionally uses this same value for compatible JWT signatures.
- **Browser token storage remains a risk.** The current frontend stores bearer tokens in `localStorage`; an XSS vulnerability could steal them. HttpOnly secure cookies or a stricter token strategy should be evaluated in a future frontend/security phase.
- **CORS is currently permissive for compatibility.** The Spring service temporarily allows all origins, matching the Worker. Production configuration should allow only the deployed frontend origins.
- **Monitoring and response are required.** Treat migration as a credential-security incident improvement: restrict database access, rotate any potentially exposed secrets, support password resets, and monitor failed login patterns.
