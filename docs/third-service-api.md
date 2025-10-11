---
# Third Service API Documen---
# Third Service API Documentation

## POST /api/v1/jobs/createTask

### Create Task

Create a new generation task

### Request Parameters

The API accepts a JSON payload with the following structure:

#### Request Body Structure

```json
{
  "model": "string",
  "callBackUrl": "string (optional)",
  "input": {
    // Input parameters based on form configuration
  }
}
```

#### Root Level Parameters

| Parameter | Required | Type | Description | Example |
|-----------|----------|------|-------------|---------|
| model | Yes | string | The model name to use for generation | "sora-2-text-to-video" or "sora-2-image-to-video" |
| callBackUrl | No | string | Callback URL for task completion notifications. Optional parameter. If provided, the system will send POST requests to this URL when the task completes (success or failure). If not provided, no callback notifications will be sent. | "https://your-domain.com/api/callback" |

---

## Text-to-Video Model

### Input Object Parameters (sora-2-text-to-video)

| Parameter | Required | Type | Description | Example |
|-----------|----------|------|-------------|---------|
| input.prompt | Yes | string | The text prompt describing the desired video motion<br>Max length: 5000 characters | "A professor stands at the front of a lively classroom, enthusiastically giving a lecture. On the blackboard behind him are colorful chalk diagrams. With an animated gesture, he declares to the students: \"Sora 2 is now available on Kie AI, making it easier than ever to create stunning videos.\" The students listen attentively, some smiling and taking notes." |
| input.aspect_ratio | No | string | This parameter defines the aspect ratio of the image.<br>Available options: portrait, landscape | "landscape" |

### Request Example (Text-to-Video)

#### JavaScript

```javascript
const response = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    model: 'sora-2-text-to-video',
    callBackUrl: 'https://your-domain.com/api/callback',
    input: {
      "prompt": "A professor stands at the front of a lively classroom, enthusiastically giving a lecture. On the blackboard behind him are colorful chalk diagrams. With an animated gesture, he declares to the students: "Sora 2 is now available on Kie AI, making it easier than ever to create stunning videos." The students listen attentively, some smiling and taking notes.",
      "aspect_ratio": "landscape"
    }
  })
});

const result = await response.json();
console.log(result);
```

---

## Image-to-Video Model

### Input Object Parameters (sora-2-image-to-video)

| Parameter | Required | Type | Description | Example |
|-----------|----------|------|-------------|---------|
| input.prompt | Yes | string | The text prompt describing the desired video motion<br>Max length: 5000 characters | "A claymation conductor passionately leads a claymation orchestra, while the entire group joyfully sings in chorus the phrase: \"Sora 2 is now available on Kie AI.\"" |
| input.image_urls | Yes | array(string) | Array of image URLs to use as the first frame. Must be publicly accessible<br>Accepted types: image/jpeg, image/png, image/webp<br>Max size: 10.0MB | ["https://file.aiquickdraw.com/custom-page/akr/section-images/17594315607644506ltpf.jpg"] |
| input.aspect_ratio | No | string | This parameter defines the aspect ratio of the image.<br>Available options: portrait, landscape | "landscape" |

### Request Example (Image-to-Video)

#### cURL

```bash
curl -X POST "https://api.kie.ai/api/v1/jobs/createTask" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "sora-2-image-to-video",
    "callBackUrl": "https://your-domain.com/api/callback",
    "input": {
      "prompt": "A claymation conductor passionately leads a claymation orchestra, while the entire group joyfully sings in chorus the phrase: \"Sora 2 is now available on Kie AI.\"",
      "image_urls": [
        "https://file.aiquickdraw.com/custom-page/akr/section-images/17594315607644506ltpf.jpg"
      ],
      "aspect_ratio": "landscape"
    }
}'
```

#### JavaScript

```javascript
const response = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    model: 'sora-2-image-to-video',
    callBackUrl: 'https://your-domain.com/api/callback',
    input: {
      "prompt": "A claymation conductor passionately leads a claymation orchestra, while the entire group joyfully sings in chorus the phrase: \"Sora 2 is now available on Kie AI.\"",
      "image_urls": [
        "https://file.aiquickdraw.com/custom-page/akr/section-images/17594315607644506ltpf.jpg"
      ],
      "aspect_ratio": "landscape"
    }
  })
});

const result = await response.json();
console.log(result);
```

---## POST /api/v1/jobs/createTask

### Create Task

Create a new generation task

### Request Parameters

The API accepts a JSON payload with the following structure:

#### Request Body Structure

```json
{
  "model": "string",
  "callBackUrl": "string (optional)",
  "input": {
    // Input parameters based on form configuration
  }
}
```
#### Root Level Parameters

| Parameter | Required | Type | Description | Example |
|-----------|----------|------|-------------|---------|
| model | Yes | string | The model name to use for generation | "sora-2-text-to-video" |
| callBackUrl | No | string | Callback URL for task completion notifications. Optional parameter. If provided, the system will send POST requests to this URL when the task completes (success or failure). If not provided, no callback notifications will be sent. | "https://your-domain.com/api/callback" |

#### Input Object Parameters

The input object contains the following parameters based on the form configuration:

| Parameter | Required | Type | Description | Example |
|-----------|----------|------|-------------|---------|
| input.prompt | Yes | string | The text prompt describing the desired video motion<br>Max length: 5000 characters | "A professor stands at the front of a lively classroom, enthusiastically giving a lecture. On the blackboard behind him are colorful chalk diagrams. With an animated gesture, he declares to the students: \"Sora 2 is now available on Kie AI, making it easier than ever to create stunning videos.\" The students listen attentively, some smiling and taking notes." |
| input.aspect_ratio | No | string | This parameter defines the aspect ratio of the image.<br>Available options: portrait, landscape | "landscape" |

### Request Example

#### cURL

```bash
curl -X POST "https://api.kie.ai/api/v1/jobs/createTask" \
#### Input Object Parameters

The input object contains the following parameters based on the form configuration:

input.prompt
Required
string
The text prompt describing the desired video motion

Max length: 5000 characters
Example:

"A professor stands at the front of a lively classroom, enthusiastically giving a lecture. On the blackboard behind him are colorful chalk diagrams. With an animated gesture, he declares to the students: “Sora 2 is now available on Kie AI, making it easier than ever to create stunning videos.” The students listen attentively, some smiling and taking notes."
| input.aspect_ratio | No | string | This parameter defines the aspect ratio of the image.<br>Available options: portrait, landscape | "landscape" |
Request Example

JavaScript
```
const response = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    model: 'sora-2-text-to-video',
    callBackUrl: 'https://your-domain.com/api/callback',
    input: {
      "prompt": "A professor stands at the front of a lively classroom, enthusiastically giving a lecture. On the blackboard behind him are colorful chalk diagrams. With an animated gesture, he declares to the students: “Sora 2 is now available on Kie AI, making it easier than ever to create stunning videos.” The students listen attentively, some smiling and taking notes.",
      "aspect_ratio": "landscape"
    }
  })
});
```
const result = await response.json();
console.log(result);
```

### Response Example

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "taskId": "task_12345678"
  }
}
```

### Response Fields

| Field | Description |
|-------|-------------|
| code | Status code, 200 for success, others for failure |
| message | Response message, error description when failed |
| data.taskId | Task ID for querying task status |

### Callback Notifications

When you provide the callBackUrl parameter when creating a task, the system will send POST requests to the specified URL upon task completion (success or failure).

#### Success Callback Example

```json
{
    "code": 200,
    "data": {
        "completeTime": 1755599644000,
        "consumeCredits": 100,
        "costTime": 8,
        "createTime": 1755599634000,
        "model": "sora-2-text-to-video",
        "param": "{\"callBackUrl\":\"https://your-domain.com/api/callback\",\"model\":\"sora-2-text-to-video\",\"input\":{\"prompt\":\"A professor stands at the front of a lively classroom, enthusiastically giving a lecture. On the blackboard behind him are colorful chalk diagrams. With an animated gesture, he declares to the students: “Sora 2 is now available on Kie AI, making it easier than ever to create stunning videos.” The students listen attentively, some smiling and taking notes.\",\"aspect_ratio\":\"landscape\"}}",
        "remainedCredits": 2510330,
        "resultJson": "{\"resultUrls\":[\"https://example.com/generated-image.jpg\"]}",
        "state": "success",
        "taskId": "e989621f54392584b05867f87b160672",
        "updateTime": 1755599644000
    },
    "msg": "Playground task completed successfully."
}
```

#### Failure Callback Example

```json
{
    "code": 501,
    "data": {
        "completeTime": 1755597081000,
        "consumeCredits": 0,
        "costTime": 0,
        "createTime": 1755596341000,
        "failCode": "500",
        "failMsg": "Internal server error",
        "model": "sora-2-text-to-video",
        "param": "{\"callBackUrl\":\"https://your-domain.com/api/callback\",\"model\":\"sora-2-text-to-video\",\"input\":{\"prompt\":\"A professor stands at the front of a lively classroom, enthusiastically giving a lecture. On the blackboard behind him are colorful chalk diagrams. With an animated gesture, he declares to the students: “Sora 2 is now available on Kie AI, making it easier than ever to create stunning videos.” The students listen attentively, some smiling and taking notes.\",\"aspect_ratio\":\"landscape\"}}",
        "remainedCredits": 2510430,
        "state": "fail",
        "taskId": "bd3a37c523149e4adf45a3ddb5faf1a8",
        "updateTime": 1755597097000
    },
    "msg": "Playground task failed."
}
```

#### Important Notes

- The callback content structure is identical to the Query Task API response
- The param field contains the complete Create Task request parameters, not just the input section
- If callBackUrl is not provided, no callback notifications will be sent

## GET /api/v1/jobs/recordInfo

### Query Task

Query task status and results by task ID

### Request Example

#### Javascript

```
const response = await fetch('https://api.kie.ai/api/v1/jobs/recordInfo?taskId=task_12345678', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const result = await response.json();
console.log(result);
```

### Response Example

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "taskId": "task_12345678",
    "model": "sora-2-text-to-video",
    "state": "success",
    "param": "{\"model\":\"sora-2-text-to-video\",\"callBackUrl\":\"https://your-domain.com/api/callback\",\"input\":{\"prompt\":\"A professor stands at the front of a lively classroom, enthusiastically giving a lecture. On the blackboard behind him are colorful chalk diagrams. With an animated gesture, he declares to the students: “Sora 2 is now available on Kie AI, making it easier than ever to create stunning videos.” The students listen attentively, some smiling and taking notes.\",\"aspect_ratio\":\"landscape\"}}",
    "resultJson": "{\"resultUrls\":[\"https://example.com/generated-image.jpg\"]}",
    "failCode": "",
    "failMsg": "",
    "completeTime": 1698765432000,
    "createTime": 1698765400000,
    "updateTime": 1698765432000
  }
}
```

### Response Fields

| Field | Description |
|-------|-------------|
| code | Status code, 200 for success, others for failure |
| message | Response message, error description when failed |
| data.taskId | Task ID |
| data.model | Model used for generation |
| data.state | Generation state |
| data.param | Complete Create Task request parameters as JSON string (includes model, callBackUrl, input and all other parameters) |
| data.resultJson | Result JSON string containing generated media URLs |
| data.failCode | Error code (when generation failed) |
| data.failMsg | Error message (when generation failed) |
| data.completeTime | Completion timestamp |
| data.createTime | Creation timestamp |
| data.updateTime | Update timestamp |

### State Values

| State | Description |
|-------|-------------|
| waiting | Waiting for generation |
| queuing | In queue |
| generating | Generating |
| success | Generation successful |
| fail | Generation failed |
---
