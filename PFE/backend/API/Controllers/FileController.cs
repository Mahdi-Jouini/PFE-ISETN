using AutoMapper;
using Domain.Commands;
using Domain.DTOs;
using Domain.Models;
using Domain.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;

        public FileController(IWebHostEnvironment environment, IMediator mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
            _environment = environment;
        }

        [HttpPost("UploadFile")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file was uploaded");

            string fileName = Path.GetRandomFileName() + Path.GetExtension(file.FileName);

            string uploadPath = Path.Combine(_environment.ContentRootPath, "Uploads");

            Directory.CreateDirectory(uploadPath);

            string filePath = Path.Combine(uploadPath, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return Ok(new { fileName });
        }

        [HttpPost("UploadMultipleFiles")]
        public async Task<IActionResult> UploadMultipleFiles(List<IFormFile> files)
        {
            if (files == null || !files.Any())
                return BadRequest("No files were uploaded.");
            string uploadPath = Path.Combine(_environment.ContentRootPath, "Uploads");
            Directory.CreateDirectory(uploadPath);

            var uploadedFiles = new List<object>();
            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    string fileName = Path.GetRandomFileName() + Path.GetExtension(file.FileName);
                    string filePath = Path.Combine(uploadPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    uploadedFiles.Add(new
                    {
                        originalName = file.FileName,
                        size = file.Length,
                        url = fileName,
                        type = file.ContentType
                    });
                }
            }
            return Ok(uploadedFiles);
        }

        [HttpPost("AddFilesAttachment")]
        public async Task<IActionResult> AddFilesAttachment([FromBody] List<FilesAttachmentDTO> files)
        {
            if (files == null || !files.Any())
                return BadRequest("No files provided.");

            var attachments = _mapper.Map<List<FilesAttachment>>(files);

            var results = new List<object>();
            foreach (var attachment in attachments)
            {
                var result = await _mediator.Send(new PostGeneric<FilesAttachment>(attachment));
                results.Add(result);
            }
            return Ok(results);
        }

        [HttpGet("{fileName}")]
        public IActionResult GetFile(string fileName)
        {
            if (string.IsNullOrEmpty(fileName) || fileName.Contains(".."))
            {
                return BadRequest("Invalid file name");
            }

            string uploadPath = Path.Combine(_environment.ContentRootPath, "Uploads");
            string filePath = Path.Combine(uploadPath, fileName);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("File not found");
            }

            var provider = new FileExtensionContentTypeProvider();
            string contentType = "application/octet-stream";
            if (provider.TryGetContentType(filePath, out string contentTypeResult))
            {
                contentType = contentTypeResult;
            }

            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

            // 🟢 Force the file to open in browser if possible
            Response.Headers["Content-Disposition"] = $"inline; filename={Path.GetFileName(filePath)}";

            return File(fileStream, contentType);
        }


        [HttpGet("getAllAttachmentBySprint")]
        public async Task<ActionResult<IEnumerable<FilesAttachment>>> GetAllAttachmentBySprint(string sprintId)
        {
            var attachments = await _mediator.Send(new GetAllGeneric<FilesAttachment>(a => a.SprintId.Equals(sprintId)));
            var attachmentDto = _mapper.Map<List<FilesAttachmentDTO>>(attachments);
            return Ok(attachmentDto);
        }
        [HttpGet("getAllAttachmentByProject")]
        public async Task<ActionResult<IEnumerable<FilesAttachmentDTO>>> GetAllAttachmentByProject(string projectId)
        {
            var attachments = await _mediator.Send(new GetAllGeneric<FilesAttachment>(a => a.ProjectId.Equals(projectId)));
            var attachmentDto = _mapper.Map<List<FilesAttachmentDTO>>(attachments);
            return Ok(attachmentDto);
        }
        [HttpGet("getAllAttachmentByTicket")]
        public async Task<ActionResult<IEnumerable<FilesAttachment>>> GetAllAttachmentByTicket(string ticketId)
        {
            var attachments = await _mediator.Send(new GetAllGeneric<FilesAttachment>(a => a.TicketId.Equals(ticketId)));
            var attachmentDto = _mapper.Map<List<FilesAttachmentDTO>>(attachments);
            return Ok(attachmentDto);
        }
        [HttpGet("deleteAttachment")]
        public async Task<string> DeleteAttachment(string attachmentId)
        {
            return await _mediator.Send(new DeleteGeneric<FilesAttachment>(attachmentId));
        }
    }
}
