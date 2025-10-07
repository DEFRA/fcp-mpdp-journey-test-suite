#!/bin/sh

echo "run_id: $RUN_ID"
npm run zap:start &

echo "Waiting for ZAP to start..."

# Wait for ZAP to be ready with retries
MAX_ATTEMPTS=30
ATTEMPT=1
SLEEP_TIME=5

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
  echo "Checking ZAP status (attempt $ATTEMPT/$MAX_ATTEMPTS)..."
  
  if curl -s --max-time 5 http://localhost:8080 >/dev/null; then
    echo "ZAP is running"
    break
  fi
  
  if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo "ZAP failed to start after $MAX_ATTEMPTS attempts"
    exit 1
  fi
  
  echo "ZAP not ready yet, waiting ${SLEEP_TIME}s..."
  sleep $SLEEP_TIME
  ATTEMPT=$((ATTEMPT + 1))
done

TEST_SCRIPT=${TEST_SCRIPT:-"browserstack"}

npm run test:$TEST_SCRIPT

# if PUBLISH_TEST_RESULTS is not set, default to true
PUBLISH_TEST_RESULTS=${PUBLISH_TEST_RESULTS:- 1}

if [ "$PUBLISH_TEST_RESULTS" -eq 1 ]; then
  npm run report:publish
  publish_exit_code=$?

  if [ $publish_exit_code -ne 0 ]; then
    echo "failed to publish test results"
    exit $publish_exit_code
  fi
fi

# At the end of the test run, if the suite has failed we write a file called 'FAILED'
if [ -f FAILED ]; then
  echo "test suite failed"
  cat ./FAILED
  exit 1
fi

echo "test suite passed"
exit 0
