# Netlify Setup Guide - Staging Project

This guide walks you through setting up the `divflow-staging` Netlify project for the Divergent Flow UI.

## Prerequisites

- Admin access to the GitHub repository: `jgsteeler/divergent-flow-ui`
- Access to Netlify account

## Step 1: Delete Current Netlify Project

1. Go to <https://app.netlify.com>
2. Select your current Divergent Flow UI project
3. Navigate to: **Site settings** → **General** → **Danger Zone**
4. Click **Delete this site**
5. Confirm deletion by typing the site name

## Step 2: Set Up GitHub Branch Protection for `develop`

### Option A: Via GitHub UI (Recommended)

1. Go to <https://github.com/jgsteeler/divergent-flow-ui/settings/branches>
2. Click **Add branch protection rule**
3. Configure as follows:
   - **Branch name pattern**: `develop`
   - ✅ **Require a pull request before merging**
     - ✅ Require approvals: 1
     - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ **Require status checks to pass before merging**
     - ✅ Require branches to be up to date before merging
     - (Add specific status checks once CI is set up)
   - ✅ **Do not allow bypassing the above settings**
     - Uncheck "Allow specified actors to bypass required pull requests" unless you want admins to bypass
4. Click **Create** or **Save changes**

### Option B: Via GitHub CLI (if installed)

```bash
# Protect develop branch
gh api repos/jgsteeler/divergent-flow-ui/branches/develop/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":[]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false
```

## Step 3: Create New Netlify Staging Project

1. Go to <https://app.netlify.com>
2. Click **Add new site** → **Import an existing project**
3. Choose **GitHub** as your Git provider
4. Select the repository: `jgsteeler/divergent-flow-ui`
5. Configure build settings:
   - **Branch to deploy**: `develop`
   - **Build command**: `npm run build` (auto-detected from netlify.toml)
   - **Publish directory**: `dist` (auto-detected from netlify.toml)
6. Click **Deploy site**

## Step 4: Configure Netlify Site Settings

### 4.1 Change Site Name

1. Go to **Site settings** → **General** → **Site details**
2. Click **Change site name**
3. Enter: `divflow-staging`
4. Click **Save**

### 4.2 Verify Environment Variables

The variables should be automatically loaded from `netlify.toml`, but verify:

1. Go to **Site settings** → **Environment variables**
2. Confirm these are set for the **develop** branch:
   - `VITE_API_URL`
   - `VITE_OIDC_ISSUER_URL`
   - `VITE_OIDC_CLIENT_ID`
   - `VITE_OIDC_REDIRECT_URI`
   - `VITE_OIDC_POST_LOGOUT_REDIRECT_URI`
   - `VITE_OIDC_SCOPES`

### 4.3 Update Redirect URI in Keycloak

1. Go to your Keycloak admin console
2. Navigate to the `df-staging` realm → Clients → `web-app`
3. Update **Valid redirect URIs** to include:

   ```
   https://divflow-staging.netlify.app/*
   https://deploy-preview-*.netlify.app/*
   ```

4. Update **Valid post logout redirect URIs** to include:

   ```
   https://divflow-staging.netlify.app
   https://deploy-preview-*.netlify.app
   ```

5. Save the client configuration

### 4.4 Enable Deploy Previews (Optional but Recommended)

1. Go to **Site settings** → **Build & deploy** → **Deploy contexts**
2. Ensure **Deploy Preview** is enabled for:
   - ✅ Any pull request against your production branch (develop)
3. This allows testing PRs before merging to develop

## Step 5: Test Deployment

### 5.1 Trigger Manual Deploy

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for build to complete

### 5.2 Verify Site

1. Visit: <https://divflow-staging.netlify.app>
2. Test OIDC login flow
3. Test API connectivity to staging gateway
4. Check browser console for any errors

## Step 6: Update Todo List

Once staging is working, create the production project:

1. Create new Netlify site: `divflow-prod`
2. Deploy from `main` branch
3. Use production environment variables (already defined in netlify.toml under `context.production`)
4. Update production Keycloak client with production URLs

## Environment Variables Reference

### Staging (develop branch)

```
VITE_API_URL=https://divergent-flow-gateway-staging.gscdev.workers.dev
VITE_OIDC_ISSUER_URL=https://divergent-flow-keycloak.fly.dev/realms/df-staging
VITE_OIDC_CLIENT_ID=web-app
VITE_OIDC_REDIRECT_URI=https://divflow-staging.netlify.app/auth/callback
VITE_OIDC_POST_LOGOUT_REDIRECT_URI=https://divflow-staging.netlify.app
VITE_OIDC_SCOPES=openid profile email
```

### Production (main branch) - For Future Setup

```
VITE_API_URL=https://divergent-flow-gateway.gscdev.workers.dev
VITE_OIDC_ISSUER_URL=https://auth.divergentflow.com/realms/df-prod
VITE_OIDC_CLIENT_ID=web-app
VITE_OIDC_REDIRECT_URI=https://app.divergentflow.com/auth/callback
VITE_OIDC_POST_LOGOUT_REDIRECT_URI=https://app.divergentflow.com
VITE_OIDC_SCOPES=openid profile email
```

## Rollback Strategy

If a deployment fails or introduces issues:

### Via Netlify UI

1. Go to **Deploys** tab
2. Find the last known good deploy
3. Click on it, then click **Publish deploy**

### Via Git

```bash
# Revert the problematic commit
git revert <commit-hash>
git push origin develop

# Or reset to last known good commit (use with caution)
git reset --hard <good-commit-hash>
git push --force origin develop
```

## CI/CD Integration (Future)

Once you set up GitHub Actions or another CI:

1. Add status check requirements to branch protection
2. Configure Netlify to wait for checks before deploying
3. Add automated tests that run on PRs

## Troubleshooting

### Build Fails

- Check **Deploy log** in Netlify for errors
- Verify `package.json` scripts are correct
- Ensure Node version matches (20.x)

### OIDC Login Fails

- Verify redirect URIs in Keycloak match Netlify URLs exactly
- Check browser console for CORS errors
- Ensure `VITE_OIDC_*` variables are set correctly

### API Calls Fail

- Verify `VITE_API_URL` points to correct gateway
- Check gateway is deployed and accessible
- Test gateway directly with curl/Postman

## Next Steps

- [ ] Delete current Netlify project
- [ ] Set up branch protection on develop
- [ ] Create divflow-staging project
- [ ] Update Keycloak redirect URIs
- [ ] Test staging deployment
- [ ] Document any issues or adjustments needed
